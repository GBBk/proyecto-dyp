const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Genera una clave secreta aleatoria con 64 bytes de longitud (512 bits)
const generateSecretKey = () => {
  return crypto.randomBytes(64).toString("hex");
};

const secretKey = generateSecretKey();

// Función para generar un token
const createGenerateToken = (idUsuario, email) => {
  const token = jwt.sign({ idUsuario, email }, secretKey, { expiresIn: "1h" });
  return token;
};

// Función para refrescar un token (simplemente genera uno nuevo con la misma información)
const createRefreshToken = (idUsuario, email) => {
  const token = createGenerateToken(idUsuario, email);
  return token;
};

module.exports = { createGenerateToken, createRefreshToken, secretKey };
