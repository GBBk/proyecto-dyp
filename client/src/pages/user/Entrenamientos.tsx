import { API_URL } from "../../auth/constants";
import NavBar from "../../components/NavBar";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import ModalHU from "../../components/ModalHU";
import { EntrenamientosHistorial, Ejercicios } from "../../types/types";
import "../../stylesheets/historial_rutina.css";

interface EjercicioDetalle extends Ejercicios {
  bodyPart: string;
  equipo: string;
  objetivo: string;
  musculosSecundarios: string[];
  instrucciones: string[];
}

export default function Entrenamientos() {
  const [historial, setHistorial] = useState<EntrenamientosHistorial[]>([]);
  const [selectedEjercicio, setSelectedEjercicio] =
    useState<EjercicioDetalle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchEntrenamientos = async () => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = userData.idUsuario;
    try {
      const response = await fetch(`${API_URL}/historialRutina/${userId}`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.json();
      console.log(data.body.historial);
      setHistorial(data.body.historial);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEntrenamientos();
  }, []);

  const openModal = (ejercicio: EjercicioDetalle) => {
    setSelectedEjercicio(ejercicio);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedEjercicio(null);
    setIsModalOpen(false);
  };

  return (
    <>
      <header>
        <NavBar />
      </header>
      <main>
        <div className="subtitle">
          <h2 className="subtitle-h2">Entrenamientos</h2>
        </div>
        <div className="historial-usuarios">
          {historial.length === 0 ? (
            <h2 style={{ margin: "auto" }} className="center">
              No hay entrenamientos previos
            </h2>
          ) : (
            historial.map((entrenamiento, index) => (
              <div
                key={`${entrenamiento.idHistorial}+${index}`}
                className="card"
              >
                <div className="card-header">
                  Rutina: {entrenamiento.nombreRutina}
                </div>
                <div className="card-body">
                  <p>
                    <strong>Fecha:</strong>{" "}
                    {format(
                      new Date(entrenamiento.fechaRegistro),
                      "dd/MM/yyyy HH:mm"
                    )}
                  </p>
                  <p>
                    <strong>Notas:</strong> {entrenamiento.notasHistorial}
                  </p>
                  <div className="flex-gap-container">
                    <h3>Ejercicios:</h3>
                    {entrenamiento.ejercicios.map((ejercicio, index) => (
                      <div className="flex-gap-container " key={index}>
                        <p style={{ fontSize: "20px" }}>
                          {ejercicio.nombreEjercicio}
                        </p>
                        <p>
                          <strong>Series y repeticiones:</strong>{" "}
                          {ejercicio.seriesReps}
                        </p>
                        <button
                          className="ver-ejercicio-btn"
                          onClick={() => openModal(ejercicio)}
                        >
                          Ver ejercicio
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="card-footer">
                  <p>Rutina #{historial.length - index}</p>
                </div>
              </div>
            ))
          )}
        </div>
        <ModalHU isOpen={isModalOpen} onClose={closeModal}>
          {selectedEjercicio && (
            <div className="detalles-ejercicio">
              <h3>{selectedEjercicio.nombreEjercicio}</h3>
              <p className="mt9">
                <strong>Parte del cuerpo:</strong> {selectedEjercicio.bodyPart}
              </p>
              <p>
                <strong>Equipo:</strong> {selectedEjercicio.equipo}
              </p>
              <p>
                <strong>Objetivo:</strong> {selectedEjercicio.objetivo}
              </p>
              <p>
                <strong>Músculos secundarios:</strong>{" "}
                {selectedEjercicio.musculosSecundarios.join(", ")}
              </p>
              <p className="mt9">
                <strong>Instrucciones:</strong>
              </p>
              <ul>
                {selectedEjercicio.instrucciones.map((instruccion, idx) => (
                  <li key={idx}>{instruccion}</li>
                ))}
              </ul>
              {selectedEjercicio.imgUrl && (
                <div className="contenedor-imagen mt9">
                  <img
                    className="imagen-ejercicio"
                    src={selectedEjercicio.imgUrl}
                    alt="Imagen del ejercicio"
                  />
                </div>
              )}
            </div>
          )}
        </ModalHU>
      </main>
    </>
  );
}
