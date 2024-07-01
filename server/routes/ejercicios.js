const { DB_POOL } = require("../db");
const { jsonResponse } = require("../lib/jsonResponse");
const express = require("express");
const router = express.Router();

// Ruta para la obtencion, paginacion y busqueda de ejercicios
router.get("/", (req, res) => {
  const searchTerm = req.query.search || "";
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  let query = "SELECT * FROM ejercicios";
  const values = [];

  if (searchTerm) {
    query += " WHERE nombreEjercicio LIKE ?";
    values.push(`%${searchTerm}%`);
  }

  query += " LIMIT ? OFFSET ?";
  values.push(limit, offset);

  DB_POOL.query(query, values, (err, ejercicios) => {
    if (err) {
      return res.status(500).json(jsonResponse(500, { error: err }));
    } else {
      return res.status(200).json(jsonResponse(200, { ejercicios }));
    }
  });
});

// Ruta para modificar un ejercicio por su ID
router.put("/:id", async (req, res) => {
  const ejercicioId = req.params.id;
  const { nombreEjercicio, imgUrl } = req.body;

  try {
    const updateQuery =
      "UPDATE ejercicios SET nombreEjercicio = ?, imgUrl = ? WHERE idEjercicio = ?";

    DB_POOL.query(
      updateQuery,
      [nombreEjercicio, imgUrl, ejercicioId],
      (err, result) => {
        if (err) {
          return res.status(500).json(
            jsonResponse(500, {
              error: err,
            })
          );
        }

        return res.status(200).json(
          jsonResponse(200, {
            message: "Ejercicio modificado correctamente.",
          })
        );
      }
    );
  } catch (error) {
    console.error("Error al modificar el ejercicio:", error);
    return res.status(500).json(
      jsonResponse(500, {
        error: "Hubo un problema al modificar el ejercicio.",
      })
    );
  }
});

module.exports = router;
