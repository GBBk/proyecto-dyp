const express = require("express");
const router = express.Router();
const { jsonResponse } = require("../lib/jsonResponse");
const { DB_POOL } = require("../db");

// Endpoint para obtener todas las rutinas y sus ejercicios
router.get("/", (req, res) => {
  const readRoutinesQuery = `
    SELECT
      r.idRutina,
      r.nombreRutina,
      e.idEjercicio,
      e.nombreEjercicio,
      re.seriesReps
    FROM
      rutinas r
      INNER JOIN rutina_ejercicio re ON r.idRutina = re.idRutina
      INNER JOIN ejercicios e ON re.idEjercicio = e.idEjercicio
    ORDER BY
      r.idRutina, e.idEjercicio`;

  DB_POOL.query(readRoutinesQuery, (err, rutinas) => {
    if (err) {
      return res.status(500).json(jsonResponse(500, { error: err }));
    } else {
      return res.status(200).json(jsonResponse(200, { rutinas }));
    }
  });
});

router.put("/rutina/:id", (req, res) => {
  const { id } = req.params;
  const { nombreRutina, ejercicios } = req.body;

  if (!nombreRutina || !Array.isArray(ejercicios)) {
    return res.status(400).json(
      jsonResponse(400, {
        error:
          "Datos incompletos. Se requiere el nombre de la rutina y una lista de ejercicios.",
      })
    );
  }

  // Iniciar una transacción
  DB_POOL.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json(jsonResponse(500, { error: err }));
    }

    connection.beginTransaction(async (err) => {
      if (err) {
        connection.release();
        return res.status(500).json(jsonResponse(500, { error: err }));
      }

      try {
        // Actualizar el nombre de la rutina
        const updateRoutineQuery = `UPDATE rutinas SET nombreRutina = ? WHERE idRutina = ?`;
        await queryPromise(connection, updateRoutineQuery, [nombreRutina, id]);

        // Obtener los ejercicios existentes en la base de datos para la rutina
        const existingExerciseIdsQuery = `SELECT idEjercicio FROM rutina_ejercicio WHERE idRutina = ?`;
        const existingExerciseIds = await queryPromise(
          connection,
          existingExerciseIdsQuery,
          [id]
        );

        const existingIds = existingExerciseIds.map((row) => row.idEjercicio);

        // Identificar los ejercicios a eliminar
        const exercisesToDelete = existingIds.filter(
          (existingId) =>
            !ejercicios.some(
              (ejercicio) => ejercicio.idEjercicio === existingId
            )
        );

        // Eliminar los ejercicios de la tabla rutina_ejercicio
        const deleteExerciseQuery = `DELETE FROM rutina_ejercicio WHERE idRutina = ? AND idEjercicio = ?`;

        for (const exerciseId of exercisesToDelete) {
          await queryPromise(connection, deleteExerciseQuery, [id, exerciseId]);
        }

        // Insertar o actualizar ejercicios
        for (const ejercicio of ejercicios) {
          if (existingIds.includes(ejercicio.idEjercicio)) {
            // Actualizar ejercicio existente
            const updateDetailsQuery = `UPDATE rutina_ejercicio SET seriesReps = ? WHERE idRutina = ? AND idEjercicio = ?`;
            await queryPromise(connection, updateDetailsQuery, [
              ejercicio.seriesReps,
              id,
              ejercicio.idEjercicio,
            ]);
          } else {
            // Insertar nuevo ejercicio
            const insertExerciseQuery = `INSERT INTO rutina_ejercicio (idRutina, idEjercicio, seriesReps) VALUES (?, ?, ?)`;
            await queryPromise(connection, insertExerciseQuery, [
              id,
              ejercicio.idEjercicio,
              ejercicio.seriesReps,
            ]);
          }
        }

        // Commit de la transacción
        connection.commit((err) => {
          if (err) {
            return connection.rollback(() => {
              connection.release();
              return res.status(500).json(jsonResponse(500, { error: err }));
            });
          }

          connection.release();
          return res
            .status(200)
            .json(
              jsonResponse(200, { message: "Rutina actualizada exitosamente." })
            );
        });
      } catch (error) {
        connection.rollback(() => {
          connection.release();
          return res.status(500).json(jsonResponse(500, { error }));
        });
      }
    });
  });
});

router.get("/ejercicios/nombres", (req, res) => {
  const getExercisesQuery =
    "SELECT idEjercicio, nombreEjercicio FROM ejercicios";
  DB_POOL.query(getExercisesQuery, (err, results) => {
    if (err) {
      return res.status(500).json(jsonResponse(500, { error: err }));
    } else {
      return res.status(200).json(jsonResponse(200, { nombres: results }));
    }
  });
});

router.delete("/rutina/:id", (req, res) => {
  const { id } = req.params;

  // Iniciar transacción
  DB_POOL.getConnection((err, connection) => {
    if (err) {
      console.error("Error obteniendo la conexión:", err);
      return res.status(500).json(jsonResponse(500, { error: err.message }));
    }

    connection.beginTransaction((err) => {
      if (err) {
        console.error("Error iniciando la transacción:", err);
        connection.release();
        return res.status(500).json(jsonResponse(500, { error: err.message }));
      }

      // Eliminar referencias en historial_usuarios_rutinas
      const deleteHistorialQuery = `
        DELETE FROM historial_usuarios_rutinas
        WHERE idRutina = ?`;

      connection.query(deleteHistorialQuery, [id], (err) => {
        if (err) {
          console.error(
            "Error eliminando referencias en historial_usuarios_rutinas:",
            err
          );
          return connection.rollback(() => {
            connection.release();
            return res
              .status(500)
              .json(jsonResponse(500, { error: err.message }));
          });
        }

        // Eliminar referencias en usuarios_rutinas
        const deleteUsuariosRutinasQuery = `
          DELETE FROM usuarios_rutinas
          WHERE idRutina = ?`;

        connection.query(deleteUsuariosRutinasQuery, [id], (err) => {
          if (err) {
            console.error(
              "Error eliminando referencias en usuarios_rutinas:",
              err
            );
            return connection.rollback(() => {
              connection.release();
              return res
                .status(500)
                .json(jsonResponse(500, { error: err.message }));
            });
          }

          // Eliminar referencias en rutina_ejercicio
          const deleteRutinaEjercicioQuery = `
            DELETE FROM rutina_ejercicio
            WHERE idRutina = ?`;

          connection.query(deleteRutinaEjercicioQuery, [id], (err) => {
            if (err) {
              console.error(
                "Error eliminando relaciones en rutina_ejercicio:",
                err
              );
              return connection.rollback(() => {
                connection.release();
                return res
                  .status(500)
                  .json(jsonResponse(500, { error: err.message }));
              });
            }

            // Eliminar la rutina en la tabla rutinas
            const deleteRutinaQuery = `
              DELETE FROM rutinas
              WHERE idRutina = ?`;

            connection.query(deleteRutinaQuery, [id], (err) => {
              if (err) {
                console.error("Error eliminando rutina:", err);
                return connection.rollback(() => {
                  connection.release();
                  return res
                    .status(500)
                    .json(jsonResponse(500, { error: err.message }));
                });
              }

              // Commit de la transacción
              connection.commit((err) => {
                if (err) {
                  console.error("Error haciendo commit:", err);
                  return connection.rollback(() => {
                    connection.release();
                    return res
                      .status(500)
                      .json(jsonResponse(500, { error: err.message }));
                  });
                }

                connection.release();
                return res.status(200).json(
                  jsonResponse(200, {
                    message: "Rutina eliminada exitosamente.",
                  })
                );
              });
            });
          });
        });
      });
    });
  });
});

// Función para ejecutar consultas SQL con promesas
function queryPromise(connection, query, params) {
  return new Promise((resolve, reject) => {
    connection.query(query, params, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
}

module.exports = router;
