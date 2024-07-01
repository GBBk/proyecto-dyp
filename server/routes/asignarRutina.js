const express = require("express");
const router = express.Router();
const { jsonResponse } = require("../lib/jsonResponse");
const { DB_POOL } = require("../db");

router.post("/", (req, res) => {
  const { usuario, rutinas, notas } = req.body;

  // Verificar si se proporcionaron todos los datos necesarios
  if (!usuario || !rutinas || !notas) {
    return res
      .status(400)
      .json(jsonResponse(400, { error: "Faltan datos en la solicitud." }));
  }

  // Consultar y mover rutinas existentes al historial
  const selectQuery = "SELECT * FROM usuarios_rutinas WHERE idUsuario = ?";
  DB_POOL.query(selectQuery, [usuario], (selectError, selectResults) => {
    if (selectError) {
      return res
        .status(500)
        .json({ error: "Error al obtener rutinas existentes" });
    }

    // Si hay rutinas existentes, moverlas al historial
    if (selectResults.length > 0) {
      const historialInsertQuery =
        "INSERT INTO historial_usuarios_rutinas (idUsuario, idRutina, notas) VALUES ?";
      const historialInsertValues = selectResults.map((row) => [
        row.idUsuario,
        row.idRutina,
        row.notas,
      ]);

      DB_POOL.query(
        historialInsertQuery,
        [historialInsertValues],
        (historialInsertError, historialInsertResults) => {
          if (historialInsertError) {
            return res
              .status(500)
              .json({ error: "Error al insertar rutinas en el historial" });
          }

          // Eliminar rutinas existentes de la tabla principal
          const deleteQuery =
            "DELETE FROM usuarios_rutinas WHERE idUsuario = ?";
          DB_POOL.query(
            deleteQuery,
            [usuario],
            (deleteError, deleteResults) => {
              if (deleteError) {
                return res
                  .status(500)
                  .json({ error: "Error al eliminar rutinas existentes" });
              }

              // Insertar nuevas rutinas en la tabla principal
              const insertQuery =
                "INSERT INTO usuarios_rutinas (idUsuario, idRutina, notas) VALUES ?";
              const insertValues = rutinas.map((idRutina) => [
                usuario,
                idRutina,
                notas,
              ]);

              DB_POOL.query(
                insertQuery,
                [insertValues],
                (insertError, insertResults) => {
                  if (insertError) {
                    return res
                      .status(500)
                      .json({ error: "Error al asignar nuevas rutinas" });
                  }

                  res.json({ success: true });
                }
              );
            }
          );
        }
      );
    } else {
      // Si no hay rutinas existentes, insertar directamente en la tabla principal
      const insertQuery =
        "INSERT INTO usuarios_rutinas (idUsuario, idRutina, notas) VALUES ?";
      const insertValues = rutinas.map((idRutina) => [
        usuario,
        idRutina,
        notas,
      ]);

      DB_POOL.query(
        insertQuery,
        [insertValues],
        (insertError, insertResults) => {
          if (insertError) {
            return res
              .status(500)
              .json({ error: "Error al asignar nuevas rutinas" });
          }

          res
            .status(200)
            .json(
              jsonResponse(200, { message: "Datos guardados correctamente." })
            );
        }
      );
    }
  });
});

router.get("/", (req, res) => {
  readRutinaQuery = "SELECT * FROM rutinas";

  DB_POOL.query(readRutinaQuery, (err, rutinas) => {
    if (err) {
      return res.status(500).json(jsonResponse(500, { error: err }));
    } else {
      return res.status(200).json(jsonResponse(200, { rutinas }));
    }
  });
});

module.exports = router;
