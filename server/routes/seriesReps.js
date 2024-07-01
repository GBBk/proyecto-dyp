const express = require("express");
const router = express.Router();
const { jsonResponse } = require("../lib/jsonResponse");
const { DB_POOL } = require("../db");

router.get("/:userId", (req, res) => {
  const { userId } = req.params;

  const readSeriesRepsQuery = `
    SELECT 
      hr.idRutina,
      r.nombreRutina,
      re.seriesReps
    FROM 
      deporteysalud.historial_usuarios_rutinas hr
    JOIN 
      deporteysalud.rutinas r ON r.idRutina = hr.idRutina
    JOIN 
      deporteysalud.rutina_ejercicio re ON re.idRutina = hr.idRutina
    WHERE 
      hr.idUsuario = ?;
  `;

  DB_POOL.query(readSeriesRepsQuery, [userId], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res
        .status(500)
        .json(jsonResponse(500, { error: "Database error" }));
    }

    const seriesReps = results.map((row) => ({
      idRutina: row.idRutina,
      nombreRutina: row.nombreRutina,
      seriesReps: row.seriesReps,
    }));

    return res.status(200).json(jsonResponse(200, { seriesReps }));
  });
});

module.exports = router;
