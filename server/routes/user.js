const express = require("express");
const router = express.Router();
const { jsonResponse } = require("../lib/jsonResponse");
const { DB_POOL } = require("../db");

// Ruta para ver el perfil del usuario
router.get("/:userId", (req, res) => {
  const userId = req.params.userId;
  const userQuery =
    "SELECT nombreUsuario, email, edad, dni, telefono, direccion, membresia, notas, objetivo FROM usuarios WHERE idUsuario = ?";

  DB_POOL.query(userQuery, [userId], (err, userResult) => {
    if (err) {
      console.error("Error al buscar usuario en la base de datos:", err);
      return res
        .status(500)
        .json(jsonResponse(500, { error: "Internal Server Error" }));
    }

    const user = userResult[0];
    if (!user) {
      return res
        .status(404)
        .json(jsonResponse(404, { error: "Usuario no encontrado" }));
    }

    // Devolver los detalles del usuario como respuesta
    return res.status(200).json(jsonResponse(200, { user }));
  });
});

// Ruta para actualizar el perfil del usuario
router.put("/:userId", (req, res) => {
  const userId = req.params.userId;
  const { edad, dni, telefono, direccion, notas, objetivo } = req.body;
  const updateUserQuery = `
    UPDATE usuarios 
    SET  edad = ?, dni = ?, telefono = ?, direccion = ?, notas = ?, objetivo = ? 
    WHERE idUsuario = ?`;

  DB_POOL.query(
    updateUserQuery,
    [edad, dni, telefono, direccion, notas, objetivo, userId],
    (err, result) => {
      if (err) {
        console.error("Error al actualizar usuario en la base de datos:", err);
        return res
          .status(500)
          .json(jsonResponse(500, { error: "Internal Server Error" }));
      }

      return res
        .status(200)
        .json(
          jsonResponse(200, { message: "Usuario actualizado correctamente" })
        );
    }
  );
});

module.exports = router;
