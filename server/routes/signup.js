const { jsonResponse } = require("../lib/jsonResponse");
const { insertUsersPool } = require("../operations-pool");
const { DB_POOL } = require("../db");
const router = require("express").Router();

function validatePassword(password) {
  const passwordRegex = /^(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

router.post("/", (req, res) => {
  const { nombreUsuario, email, password } = req.body;

  if (!nombreUsuario || !email || !password) {
    return res
      .status(400)
      .json(jsonResponse(400, { error: "Campos sin completar" }));
  }

  // Validar la contraseña
  if (!validatePassword(password)) {
    return res.status(400).json(
      jsonResponse(400, {
        error:
          "La contraseña debe tener al menos 8 caracteres y al menos un número.",
      })
    );
  }

  // Validar el email
  if (!validateEmail(email)) {
    return res
      .status(400)
      .json(jsonResponse(400, { error: "El correo electrónico no es válido" }));
  }

  // Insertar usuario en la base de datos
  insertUsersPool(
    DB_POOL,
    { nombreUsuario, email, password },
    (error, result) => {
      if (error) {
        // Manejar errores para el registro
        if (error.message) {
          return res
            .status(400)
            .json(jsonResponse(400, { error: error.message }));
        } else {
          return res
            .status(500)
            .json(jsonResponse(500, { error: "Error interno del servidor" }));
        }
      }

      if (req.session) {
        req.session.user = {
          idUsuario: result.insertId,
          nombreUsuario,
          email,
        };
        console.log("Sesión establecida:", req.session.user);
      }

      // Registro exitoso
      res
        .status(201)
        .json(
          jsonResponse(201, { message: "Usuario registrado correctamente" })
        );
    }
  );
});

module.exports = router;
