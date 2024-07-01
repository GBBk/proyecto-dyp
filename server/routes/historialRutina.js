const express = require("express");
const router = express.Router();
const { jsonResponse } = require("../lib/jsonResponse");
const { DB_POOL } = require("../db");

router.get("/:userId", (req, res) => {
  const userId = req.params.userId;

  const readHistoryQuery = `
        SELECT DISTINCT
        h.idHistorial,
        h.idUsuario,
        h.idRutina,
        h.fechaRegistro,
        h.notas AS notasHistorial,
        r.nombreRutina,
        re.seriesReps,
        e.idEjercicio,
        e.nombreEjercicio,
        e.imgUrl,
        e.bodyPart,
        e.equipo,
        e.objetivo,
        e.musculosSecundarios,
        e.instrucciones
      FROM historial_usuarios_rutinas AS h
      INNER JOIN rutinas AS r ON h.idRutina = r.idRutina
      INNER JOIN rutina_ejercicio AS re ON r.idRutina = re.idRutina
      INNER JOIN ejercicios AS e ON re.idEjercicio = e.idEjercicio
      WHERE h.idUsuario = ?
      ORDER BY h.fechaRegistro DESC;
  `;

  DB_POOL.query(readHistoryQuery, [userId], (err, results) => {
    if (err) {
      return res.status(500).json(jsonResponse(500, { error: err.message }));
    }

    const historialMap = new Map(); // Usamos un Map para garantizar entradas únicas

    // Iteramos sobre los resultados y organizamos los datos en un mapa
    results.forEach((row) => {
      const {
        idHistorial,
        idUsuario,
        idRutina,
        notasHistorial,
        fechaRegistro,
        nombreRutina,
        idEjercicio,
        nombreEjercicio,
        imgUrl,
        seriesReps,
        bodyPart,
        equipo,
        objetivo,
        musculosSecundarios,
        instrucciones,
      } = row;

      // Si el historial aún no está en el mapa, lo agregamos
      if (!historialMap.has(idHistorial)) {
        historialMap.set(idHistorial, {
          idHistorial,
          idUsuario,
          idRutina,
          notasHistorial,
          fechaRegistro,
          nombreRutina,
          ejercicios: [],
        });
      }

      // Agregamos el ejercicio al historial correspondiente
      historialMap.get(idHistorial).ejercicios.push({
        idEjercicio,
        nombreEjercicio,
        imgUrl,
        seriesReps,
        bodyPart,
        equipo,
        objetivo,
        musculosSecundarios: JSON.parse(musculosSecundarios),
        instrucciones: JSON.parse(instrucciones),
      });
    });

    // Convertimos el mapa a un array de historiales
    const historial = Array.from(historialMap.values());

    return res.status(200).json(jsonResponse(200, { historial }));
  });
});

module.exports = router;
