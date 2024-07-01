import React, { useState, useEffect } from "react";
import NavBarAdmin from "../../components/NavBarAdmin";
import SuccessMessage from "../../components/SuccessMessage.tsx";
import ErrorMessage from "../../components/ErrorMessage.tsx";
import SelectEjercicios from "../../components/SelectEjercicios.tsx";
import { API_URL } from "../../auth/constants";
import { Ejercicios } from "../../types/types";
import "../../stylesheets/crearRutina.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

interface EjercicioState {
  idEjercicio: number;
  series: number;
  reps: number[];
}

const CrearRutina: React.FC = () => {
  const [ejercicios, setEjercicio] = useState<Ejercicios[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [nombreRutina, setNombreRutina] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<EjercicioState[]>(
    []
  );

  const fetchEjercicios = async () => {
    try {
      const response = await fetch(`${API_URL}/crearRutina`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });
      if (!response.ok) {
        throw new Error("Hubo un problema al obtener los ejercicios.");
      }
      const data = await response.json();
      setEjercicio(data.body.ejercicios);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRutinaSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formattedExercises = selectedExercises.map((exercise) => ({
        idEjercicio: exercise.idEjercicio,
        seriesReps: `${exercise.series} de ${exercise.reps.join("-")}`,
      }));

      const response = await fetch(`${API_URL}/crearRutina`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          nombreRutina: nombreRutina,
          ejercicios: formattedExercises,
        }),
      });
      if (!response.ok) {
        setSuccessMessage("");
        setErrorMessage("Hubo un problema al crear la rutina.");
        throw new Error("Hubo un problema al crear la rutina.");
      }
      const data = await response.json();
      console.log(data);
      setSuccessMessage("Rutina creada con éxito!");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleAddExercise = () => {
    setSelectedExercises([
      ...selectedExercises,
      { idEjercicio: 0, series: 1, reps: [0] },
    ]);
  };

  const handleExerciseChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    const newExercises = [...selectedExercises];
    if (name === "series") {
      const series = parseInt(value, 10);
      const reps = new Array(series).fill(0);
      newExercises[index] = {
        ...newExercises[index],
        series,
        reps,
      };
    } else if (name.startsWith("reps")) {
      const repIndex = parseInt(name.split("-")[1], 10);
      const reps = [...newExercises[index].reps];
      reps[repIndex] = parseInt(value, 10);
      newExercises[index] = {
        ...newExercises[index],
        reps,
      };
    } else if (name === "idEjercicio") {
      newExercises[index] = {
        ...newExercises[index],
        idEjercicio: parseInt(value, 10),
      };
    }
    setSelectedExercises(newExercises);
  };

  const handleRemoveExercise = (index: number) => {
    const newExercises = [...selectedExercises];
    newExercises.splice(index, 1);
    setSelectedExercises(newExercises);
  };

  useEffect(() => {
    fetchEjercicios();
  }, []);

  return (
    <>
      <header>
        <NavBarAdmin />
      </header>
      <main>
        <div className="subtitle">
          <h2 className="subtitle-h2">Crear rutina</h2>
        </div>
        <div className="contenido-container">
          {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
          <form
            className="ar-container"
            onSubmit={handleRutinaSubmit}
            id="rutinaForm"
          >
            <p className="nombre-rutina">Nombre de la Rutina:</p>
            <input
              type="text"
              id="nombreRutina"
              autoComplete="off"
              className="input-crear-rutina"
              onChange={(e) => setNombreRutina(e.currentTarget.value)}
              required
            />

            <h2>Ejercicios:</h2>

            <div id="ejerciciosContainer">
              {selectedExercises.map((exercise, index) => (
                <div className="ejercicio-container" key={index}>
                  <label className="ejercicio-rutina">Ejercicio:</label>
                  <SelectEjercicios
                    options={ejercicios}
                    onChange={(selectedId) =>
                      handleExerciseChange(
                        {
                          target: {
                            name: "idEjercicio",
                            value: selectedId.toString(),
                          },
                        },
                        index
                      )
                    }
                  />
                  <label className="ejercicio-rutina">
                    Cantidad de series:
                  </label>
                  <input
                    type="number"
                    className="input-crear-rutina"
                    name="series"
                    autoComplete="off"
                    required
                    min="1"
                    value={exercise.series}
                    onChange={(e) => handleExerciseChange(e, index)}
                  />
                  <div className="series-container">
                    {Array.from({ length: exercise.series }, (_, repIndex) => (
                      <div className="series" key={repIndex}>
                        <label className="ejercicio-rutina">
                          Serie {repIndex + 1}:
                        </label>
                        <input
                          type="number"
                          className="input-crear-rutina"
                          autoComplete="off"
                          name={`reps-${repIndex}`}
                          required
                          value={exercise.reps[repIndex]}
                          onChange={(e) => handleExerciseChange(e, index)}
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    className="eliminar-ejercicio-btn center"
                    type="button"
                    onClick={() => handleRemoveExercise(index)}
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="rounded-plus-btn fz"
              onClick={handleAddExercise}
              id="agregarEjercicio"
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
            <button className="form__submit fz" type="submit">
              Crear Rutina
            </button>
          </form>
        </div>
      </main>
    </>
  );
};

export default CrearRutina;
