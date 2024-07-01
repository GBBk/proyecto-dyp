const express = require("express");
const router = express.Router();
const { jsonResponse } = require("../lib/jsonResponse");
const { DB_POOL } = require("../db");

router.post("/", (req, res) => {
  const { idUsuario, idMembresia, fechaAsignacion, fechaVencimiento } =
    req.body;

  // Comenzar una transacción
  DB_POOL.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json(jsonResponse(500, { error: err }));
    }

    connection.beginTransaction((err) => {
      if (err) {
        connection.release();
        return res.status(500).json(jsonResponse(500, { error: err }));
      }

      const obtenerNombreMembresiaQuery = `SELECT nombreMembresia FROM membresias WHERE idMembresia = ?`;
      connection.query(
        obtenerNombreMembresiaQuery,
        [idMembresia],
        (err, result) => {
          if (err) {
            return connection.rollback(() => {
              connection.release();
              return res.status(500).json(jsonResponse(500, { error: err }));
            });
          }

          if (result.length === 0) {
            return connection.rollback(() => {
              connection.release();
              return res
                .status(404)
                .json(jsonResponse(404, { error: "Membresía no encontrada" }));
            });
          }

          const nombreMembresia = result[0].nombreMembresia;

          const asignarMembresiaQuery = `INSERT INTO membresias_usuarios (idUsuario, idMembresia, fechaAsignacion, fechaVencimiento) VALUES (?,?,?,?)`;
          const asignarMembresiaValues = [
            idUsuario,
            idMembresia,
            fechaAsignacion,
            fechaVencimiento,
          ];

          connection.query(
            asignarMembresiaQuery,
            asignarMembresiaValues,
            (err, result) => {
              if (err) {
                return connection.rollback(() => {
                  connection.release();
                  return res
                    .status(500)
                    .json(jsonResponse(500, { error: err }));
                });
              }

              const actualizarUsuarioQuery = `UPDATE usuarios SET membresia = ? WHERE idUsuario = ?`;
              const actualizarUsuarioValues = [nombreMembresia, idUsuario];

              connection.query(
                actualizarUsuarioQuery,
                actualizarUsuarioValues,
                (err, result) => {
                  if (err) {
                    return connection.rollback(() => {
                      connection.release();
                      return res
                        .status(500)
                        .json(jsonResponse(500, { error: err }));
                    });
                  }

                  connection.commit((err) => {
                    if (err) {
                      return connection.rollback(() => {
                        connection.release();
                        return res
                          .status(500)
                          .json(jsonResponse(500, { error: err }));
                      });
                    }

                    connection.release();
                    return res.status(200).json(jsonResponse(200, { result }));
                  });
                }
              );
            }
          );
        }
      );
    });
  });
});

module.exports = router;
