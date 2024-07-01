const { jsonResponse } = require("../lib/jsonResponse");
const { DB_CONNECTION } = require("../db");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const secretKey = require("../auth/tokens").secretKey;

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json(jsonResponse(400, { error: "Campos sin completar" }));
  }

  try {
    const userQuery = "SELECT * FROM usuarios WHERE email = ?";
    const userValues = [email];

    DB_CONNECTION.query(
      userQuery,
      userValues,
      async (userError, userResult) => {
        if (userError) {
          console.error(
            "Error al buscar usuario en la base de datos:",
            userError
          );
          return res
            .status(500)
            .json(jsonResponse(500, { error: "Internal Server Error" }));
        }

        const user = userResult[0];
        if (!user) {
          return res.status(401).json(
            jsonResponse(401, {
              error: "Correo electrónico o contraseña inválidos",
            })
          );
        }

        // Comparar la contraseña proporcionada con el hash almacenado en la base de datos
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
          return res.status(401).json(
            jsonResponse(401, {
              error: "Correo electrónico o contraseña inválidos",
            })
          );
        }

        // Generar un token de sesión utilizando jwt.sign()
        const token = jwt.sign(
          {
            idUsuario: user.idUsuario,
            nombreUsuario: user.nombreUsuario,
            email: user.email,
          },
          secretKey,
          { expiresIn: "1h" } // Opcional: establecer una duración de expiración para el token
        );

        // Almacenar datos del usuario y el token en la sesión
        req.session.user = {
          idUsuario: user.idUsuario,
          nombreUsuario: user.nombreUsuario,
          email: user.email,
        };
        req.session.token = token;

        console.log("Sesión iniciada:", req.session.user);
        console.log("Admin:", user.admin);

        // Devolver datos del usuario y el token en la respuesta
        res.status(200).json(
          jsonResponse(200, {
            user: req.session.user,
            token: token,
            isAdmin: user.admin,
          })
        );
      }
    );
  } catch (err) {
    console.error("Error al procesar la solicitud:", err);
    res.status(500).json(jsonResponse(500, { error: "Internal Server Error" }));
  }
});

module.exports = router;
