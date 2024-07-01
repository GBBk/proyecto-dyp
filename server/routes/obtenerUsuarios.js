const express = require("express");
const router = express.Router();
const { jsonResponse } = require("../lib/jsonResponse");
const { DB_POOL } = require("../db");
const { readUsersNamePool } = require("../operations-pool");

router.get("/", (req, res) => {
  readUsersNamePool(DB_POOL, (err, users) => {
    if (err) {
      return res.status(500).json(jsonResponse(500, { error: err }));
    }

    return res.status(200).json(jsonResponse(200, { users }));
  });
});

module.exports = router;
