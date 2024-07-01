const express = require("express");
const router = express.Router();
const { jsonResponse } = require("../lib/jsonResponse");
const { DB_POOL } = require("../db");

router.post("/", (req, res) => {
  const { nombreRutina, ejercicios } = req.body;

  // Insertar el nombre de la rutina en la tabla 'rutinas'
  const insertRutQuery = "INSERT INTO rutinas (nombreRutina) VALUES (?)";
  const insertRutValues = [nombreRutina];

  DB_POOL.query(insertRutQuery, insertRutValues, (err, result) => {
    if (err) {
      return res.status(500).json(jsonResponse(500, { error: err }));
    }
    const idRutina = result.insertId;

    // Insertar los ejercicios de la rutina en la tabla 'rutinaEjercicio' con los datos
    // de los ejercicios asignados a la rutina
    const insertEjercicioQuery =
      "INSERT INTO rutina_ejercicio (idRutina, idEjercicio, seriesReps) VALUES ?";
    const ejercicioValues = ejercicios.map((ejercicio) => [
      idRutina,
      ejercicio.idEjercicio,
      ejercicio.seriesReps,
    ]);

    DB_POOL.query(insertEjercicioQuery, [ejercicioValues], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      return res.status(200).json(jsonResponse(200, { result }));
    });
  });
});

router.get("/", (req, res) => {
  searchExQuery = "SELECT * FROM ejercicios";

  DB_POOL.query(searchExQuery, (err, ejercicios) => {
    if (err) {
      return res.status(500).json(jsonResponse(500, { error: err }));
    } else {
      return res.status(200).json(jsonResponse(200, { ejercicios }));
    }
  });
});

module.exports = router;
