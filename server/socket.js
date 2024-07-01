const { Server } = require("socket.io");
const mysql = require("mysql2/promise");
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "password",
  database: "deporteysalud",
};

function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Se conecto un usuario");

    // Evento para unirse a la sala basada en userId
    socket.on("joinRoom", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined room ${userId}`);
    });

    socket.on("sendMessage", async (message) => {
      const { senderId, receiverId, content } = message;

      // Save message to database
      const connection = await mysql.createConnection(dbConfig);
      await connection.execute(
        "INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)",
        [senderId, receiverId, content]
      );
      await connection.end();

      // Emit the message to the receiver's room
      io.to(receiverId).emit("receiveMessage", message);
    });

    socket.on("disconnect", () => {
      console.log("Usuario desconectado");
    });
  });
}

module.exports = initializeSocket;
