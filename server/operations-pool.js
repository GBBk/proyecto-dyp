const mysql = require("mysql");
const bcrypt = require("bcrypt");

// Pool para el registro de usuarios
function insertUsersPool(pool, data, callback) {
  let insertQuery =
    "INSERT INTO usuarios (nombreUsuario, email, password) VALUES (?, ?, ?)";

  // Verificar si el mail registrado esta en uso
  const emailCheckQuery = "SELECT * FROM usuarios WHERE email = ?";
  const emailCheckValues = [data.email];

  pool.getConnection(function (err, connection) {
    if (err) {
      console.error("Error getting connection:", err);
      return callback(err); // Pasa el error al callback
    }

    pool.query(
      emailCheckQuery,
      emailCheckValues,
      async (emailCheckError, emailCheckResults) => {
        if (emailCheckError) {
          console.error("Error checking email:", emailCheckError);
          connection.release(); // Libera la conexion en error
          return callback(emailCheckError); // Pasa el error al callback
        }

        if (emailCheckResults.length > 0) {
          const errorMessage =
            "Email en uso. Por favor, intente con uno diferente.";
          connection.release(); // Libera la conexion en error y avisa al usuario
          return callback({ message: errorMessage }); // Pasa el mensaje de error al callback
        }

        try {
          // Hashear contraseña y formatear la query
          const hashedPassword = await bcrypt.hash(data.password, 10);
          let query = mysql.format(insertQuery, [
            data.nombreUsuario,
            data.email,
            hashedPassword,
          ]);

          // Insertar usuario en la base de datos
          connection.query(query, function (error, results) {
            if (error) {
              console.error("Error inserting user:", error);
              connection.release();
              return callback(error); // Pasa el error al callback en caso de error
            }

            callback(null, results); // Si no hay errores, pasa los resultados al callback
            connection.release();
          });
        } catch (hashingError) {
          console.error("Error hashing password:", hashingError);
          connection.release();
          return callback(hashingError);
        }
      }
    );
  });
}

function readUsersPool(pool, callback) {
  let readQuery =
    "SELECT idUsuario, nombreUsuario, email, edad, dni, telefono, direccion, notas, membresia, objetivo FROM usuarios ORDER BY idUsuario DESC";
  pool.getConnection(function (error, connection) {
    if (error) {
      console.error("Error al obtener la conexión:", error);
      callback(error, null); // Llamar al callback con el error
      return; // Salir de la función
    }
    connection.query(readQuery, function (error, results) {
      connection.release(); // Liberar la conexión independientemente del resultado
      if (error) {
        console.error("Error al ejecutar la consulta:", error);
        callback(error, null); // Llamar al callback con el error
        return; // Salir de la función
      }

      callback(null, results); // Llamar al callback con los resultados
    });
  });
}

function readUsersNamePool(pool, callback) {
  let readQuery = "SELECT idUsuario, nombreUsuario FROM usuarios";
  pool.getConnection(function (error, connection) {
    if (error) {
      console.error("Error al obtener la conexión:", error);
      callback(error, null); // Llamar al callback con el error
      return; // Salir de la función
    }
    connection.query(readQuery, function (error, results) {
      connection.release(); // Liberar la conexión independientemente del resultado
      if (error) {
        console.error("Error al ejecutar la consulta:", error);
        callback(error, null); // Llamar al callback con el error
        return; // Salir de la función
      }

      callback(null, results); // Llamar al callback con los resultados
    });
  });
}

function updateUsersPool(pool, data, callback) {
  const randomLetters = Math.random().toString(16).substring(4);
  const newEmail = `${randomLetters}@hotmail.com`;
  let updateQuery = "UPDATE usuarios SET email = ? WHERE idUsuario = ?";
  query = mysql.format(updateQuery, [newEmail, data.id]);
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(query, function (error, results) {
      if (error) throw error;
      callback(results);
      connection.release();
    });
  });
}

function removeUsersPool(pool, data, callback) {
  let removeQuery = "DELETE FROM usuarios WHERE idUsuario = ?";
  let query = mysql.format(removeQuery, [data.id]);
  pool.getConnection(function (error, connection) {
    if (error) throw error;
    connection.query(query, function (error, results) {
      if (error) throw error;
      callback(results);
      connection.release();
    });
  });
}

module.exports = {
  insertUsersPool,
  readUsersPool,
  readUsersNamePool,
  updateUsersPool,
  removeUsersPool,
};
