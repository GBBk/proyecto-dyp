const express = require("express");
const router = express.Router();
const mysql = require("mysql2/promise");
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "password",
  database: "deporteysalud",
};

router.get("/history/:userId/:receiverId", async (req, res) => {
  const { userId, receiverId } = req.params;

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      `SELECT * FROM messages 
       WHERE (sender_id = ? AND receiver_id = ?) 
       OR (sender_id = ? AND receiver_id = ?) 
       ORDER BY timestamp ASC`,
      [userId, receiverId, receiverId, userId]
    );
    await connection.end();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
