const express = require("express");
const router = express.Router();
const { jsonResponse } = require("../lib/jsonResponse");
const { DB_POOL } = require("../db");

router.get("/:userId", (req, res) => {
  const userId = req.params.userId;
  readIsAdmin = "SELECT admin FROM usuarios WHERE idUsuario = ?";

  DB_POOL.query(readIsAdmin, [userId], (err, isAdmin) => {
    if (err) {
      return jsonResponse(res, 500, err);
    } else {
      return res.status(200).json(jsonResponse(200, { isAdmin }));
    }
  });
});

module.exports = router;
