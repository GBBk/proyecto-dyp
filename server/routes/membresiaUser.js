const express = require("express");
const router = express.Router();
const { jsonResponse } = require("../lib/jsonResponse");
const { DB_POOL } = require("../db");

router.get("/:userId", (req, res) => {
  const userId = req.params.userId;

  const readMembershipUser = `
SELECT 
nombreMembresia,
descripcionMembresia,
clasesMes,
actividades,
fechaAsignacion,
fechaVencimiento
FROM membresias_usuarios
JOIN membresias ON membresias_usuarios.idMembresia = membresias.idMembresia
WHERE idUsuario = ?
ORDER BY fechaAsignacion DESC
LIMIT 1`;

  DB_POOL.query(readMembershipUser, [userId], (err, membresia) => {
    if (err) {
      return res.status(500).json(jsonResponse(500, { err }));
    } else {
      return res.status(200).json(jsonResponse(200, { membresia }));
    }
  });
});

module.exports = router;
