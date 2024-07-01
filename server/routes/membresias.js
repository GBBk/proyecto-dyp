const express = require("express");
const router = express.Router();
const { jsonResponse } = require("../lib/jsonResponse");
const { DB_POOL } = require("../db");

router.get("/", (req, res) => {
  const readMemberships = "SELECT * FROM membresias";

  DB_POOL.query(readMemberships, (err, membresias) => {
    if (err) {
      return res.status(500).json(jsonResponse(500, { error: err }));
    } else {
      return res.status(200).json(jsonResponse(200, { membresias }));
    }
  });
});

router.post("/", (req, res) => {
  const {
    nombreMembresia,
    descripcionMembresia,
    clasesMes,
    precioMembresia,
    actividades,
    avisoVencimiento,
  } = req.body;

  const createMembership = `INSERT INTO membresias (nombreMembresia, descripcionMembresia, clasesMes, precioMembresia, actividades, avisoVencimiento) VALUES (?, ?, ?, ?, ?, ?)`;

  const createMembershipValues = [
    nombreMembresia,
    descripcionMembresia,
    clasesMes,
    precioMembresia,
    actividades,
    avisoVencimiento,
  ];

  DB_POOL.query(createMembership, createMembershipValues, (err, membresia) => {
    if (err) {
      return res.status(500).json(jsonResponse(500, { error: err }));
    } else {
      return res.status(200).json(jsonResponse(200, { membresia }));
    }
  });
});

module.exports = router;
