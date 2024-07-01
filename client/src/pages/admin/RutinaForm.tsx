import React, { useState, useEffect } from "react";
import { API_URL } from "../../auth/constants";
import {
  ModificarRutinaEjercicios,
  ModificarRutina,
  EjercicioIdentifier,
} from "../../types/types";

interface RutinaFormProps {
  rutina: ModificarRutina;
  onUpdate: (rutina: ModificarRutina) => void;
  onClose: () => void;
}

const RutinaForm: React.FC<RutinaFormProps> = ({
  rutina,
  onUpdate,
  onClose,
}) => {
  const [nombreRutina, setNombreRutina] = useState(rutina.nombreRutina);
  const [ejercicios, setEjercicios] = useState<ModificarRutinaEjercicios[]>(
    rutina.ejercicios
  );
  const [nombresEjercicios, setNombresEjercicios] = useState<
    EjercicioIdentifier[]
  >([]);

  useEffect(() => {
    const fetchNombresEjercicios = async () => {
      try {
        const response = await fetch(
          `${API_URL}/gestionarRutinas/ejercicios/nombres`,
          {
            headers: {
              "ngrok-skip-browser-warning": "true",
            },
          }
        );
        if (!response.ok) {
          throw new Error(
            "Hubo un problema al obtener los nombres de los ejercicios."
          );
        }
        const data = await response.json();
        setNombresEjercicios(data.body.nombres);
      } catch (error) {
        console.error(error);
      }
    };

    fetchNombresEjercicios();
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const updatedRutina = {
      ...rutina,
      nombreRutina: nombreRutina,
      ejercicios,
    };
    onUpdate(updatedRutina);
  };

  const handleEjercicioChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const newEjercicios = [...ejercicios];
    if (field === "nombreEjercicio") {
      const selectedEjercicio = nombresEjercicios.find(
        (ejer) => ejer.nombreEjercicio === value
      );
      newEjercicios[index] = {
        ...newEjercicios[index],
        nombreEjercicio: value,
        idEjercicio: selectedEjercicio ? selectedEjercicio.idEjercicio : 0,
      };
    } else {
      newEjercicios[index] = { ...newEjercicios[index], [field]: value };
    }
    setEjercicios(newEjercicios);
  };

  const handleAddEjercicio = () => {
    const newEjercicio = {
      idEjercicio: 0,
      nombreEjercicio: "",
      seriesReps: "",
    };
    setEjercicios([...ejercicios, newEjercicio]);
  };

  const handleRemoveEjercicio = (index: number) => {
    const newEjercicios = ejercicios.filter((_, i) => i !== index);
    setEjercicios(newEjercicios);
  };

  return (
    <div className="contenido-container">
      <h2 className="subtitle-h2 center">Modificar Rutina</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre de la Rutina:
          <input
            type="text"
            value={nombreRutina}
            onChange={(e) => setNombreRutina(e.target.value)}
          />
        </label>
        <h2 style={{ margin: "15px 0 0" }} className="center">
          Ejercicios
        </h2>
        {ejercicios.map((ejercicio, index) => (
          <div className="contenedor-rutinas " key={index}>
            <label>
              Nombre del Ejercicio:
              <select
                style={{ width: "100%" }}
                value={ejercicio.nombreEjercicio}
                onChange={(e) =>
                  handleEjercicioChange(
                    index,
                    "nombreEjercicio",
                    e.target.value
                  )
                }
              >
                <option value="" disabled>
                  Selecciona un ejercicio
                </option>
                {nombresEjercicios.map((ejer) => (
                  <option key={ejer.idEjercicio} value={ejer.nombreEjercicio}>
                    {ejer.nombreEjercicio}
                  </option>
                ))}
              </select>
            </label>
            <div className="mt9">
              <label>
                Series y repeticiones:
                <input
                  type="text"
                  value={ejercicio.seriesReps}
                  onChange={(e) =>
                    handleEjercicioChange(index, "seriesReps", e.target.value)
                  }
                />
              </label>
            </div>
            <button
              className="eliminar-btn modal-btn-eliminar"
              type="button"
              onClick={() => handleRemoveEjercicio(index)}
            >
              Eliminar
            </button>
          </div>
        ))}

        <button
          className="form__submit fz center"
          type="button"
          onClick={handleAddEjercicio}
        >
          Agregar Ejercicio
        </button>
        <div className="btn-container">
          <button className="eliminar-btn" type="button" onClick={onClose}>
            Cancelar
          </button>
          <button className="editar-btn fz m5" type="submit">
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default RutinaForm;
