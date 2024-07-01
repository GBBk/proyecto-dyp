const express = require("express");
const router = express.Router();
const { jsonResponse } = require("../lib/jsonResponse");
const { DB_POOL } = require("../db");

// Endpoint para obtener el top 3 de ejercicios más realizados por un usuario
router.get("/:userId", (req, res) => {
  const { userId } = req.params;

  const topEjerciciosQuery = `
    SELECT e.nombreEjercicio, COUNT(*) AS totalVecesRealizado
    FROM historial_usuarios_rutinas hur
    JOIN rutinas r ON hur.idRutina = r.idRutina
    JOIN rutina_ejercicio re ON r.idRutina = re.idRutina
    JOIN ejercicios e ON re.idEjercicio = e.idEjercicio
    WHERE hur.idUsuario = ?
    GROUP BY e.nombreEjercicio
    ORDER BY totalVecesRealizado DESC
    LIMIT 3;
  `;

  DB_POOL.query(topEjerciciosQuery, [userId], (err, results) => {
    if (err) {
      console.error("Error al obtener el top de ejercicios:", err);
      return res
        .status(500)
        .json(
          jsonResponse(500, { error: "Error al obtener el top de ejercicios" })
        );
    }

    const topEjercicios = results.map((row) => ({
      nombreEjercicio: row.nombreEjercicio,
      totalVecesRealizado: row.totalVecesRealizado,
    }));

    return res.status(200).json(jsonResponse(200, { topEjercicios }));
  });
});

module.exports = router;
