const express = require("express");
const router = express.Router();
const { jsonResponse } = require("../lib/jsonResponse");
const { DB_POOL } = require("../db");

router.get("/:userId", (req, res) => {
  const userId = req.params.userId;

  const readRutUserQuery = `SELECT
    rutinas.idRutina,
    rutinas.nombreRutina,
    ejercicios.idEjercicio,
    ejercicios.nombreEjercicio,
    ejercicios.imgUrl,
    ejercicios.bodyPart,
    ejercicios.equipo,
    ejercicios.objetivo,
    ejercicios.musculosSecundarios,
    ejercicios.instrucciones,
    rutina_ejercicio.seriesReps,
    usuarios_rutinas.notas
  FROM
    usuarios_rutinas
  JOIN
    rutinas ON usuarios_rutinas.idRutina = rutinas.idRutina
  JOIN
    rutina_ejercicio ON rutinas.idRutina = rutina_ejercicio.idRutina
  JOIN
    ejercicios ON rutina_ejercicio.idEjercicio = ejercicios.idEjercicio
  WHERE
    usuarios_rutinas.idUsuario = ?`;

  DB_POOL.query(readRutUserQuery, [userId], (err, rutinas) => {
    if (err) {
      return res.status(500).json({ error: err });
    } else {
      const processedRutinas = rutinas.map((rutina) => {
        return {
          ...rutina,
          musculosSecundarios: JSON.parse(rutina.musculosSecundarios),
          instrucciones: JSON.parse(rutina.instrucciones),
        };
      });
      return res
        .status(200)
        .json(jsonResponse(200, { rutinas: processedRutinas }));
    }
  });
});

module.exports = router;
