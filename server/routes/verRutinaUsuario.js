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

  DB_POOL.query(readRutUserQuery, [userId], (err, rutina) => {
    if (err) {
      console.log(err);
      return res.status(500).json(jsonResponse(500, { err }));
    }
    return res.status(200).json(jsonResponse(200, { rutina }));
  });
});

module.exports = router;
