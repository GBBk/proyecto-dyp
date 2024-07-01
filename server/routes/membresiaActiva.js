const express = require("express");
const router = express.Router();
const { jsonResponse } = require("../lib/jsonResponse");
const { DB_POOL } = require("../db");

router.get("/", (req, res) => {
  membresiaActivaQuery = `SELECT u.idUsuario, 
       mu.fechaAsignacion,
       mu.fechaVencimiento
FROM usuarios u
JOIN membresias_usuarios mu ON mu.idUsuario = u.idUsuario
WHERE (mu.idUsuario, mu.fechaAsignacion) IN (
    SELECT idUsuario, MAX(fechaAsignacion)
    FROM membresias_usuarios
    GROUP BY idUsuario
)
ORDER BY u.idUsuario DESC;`;

  DB_POOL.query(membresiaActivaQuery, (err, results) => {
    if (err) {
      console.error("Error al obtener la membresía activa:", err);
      return res.status(500).json(jsonResponse(500, { error: err }));
    } else {
      return res
        .status(200)
        .json(jsonResponse(200, { membresiaActiva: results }));
    }
  });
});

module.exports = router;
