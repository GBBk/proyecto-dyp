import { API_URL } from "../../auth/constants";
import NavBar from "../../components/NavBar";
import { useState, useEffect } from "react";
import "../../stylesheets/ver_rutina.css";
import { Ejercicios } from "../../types/types";
import ModalHU from "../../components/ModalHU";

interface RutinaAsignada extends Ejercicios {
  idRutina: number;
  notas: string;
  nombreRutina: string;
  seriesReps: string;
  bodyPart: string;
  equipo: string;
  objetivo: string;
  musculosSecundarios: string[];
  instrucciones: string[];
}

export default function RutinaUsuarios() {
  const [user, setUser] = useState({
    idUsuario: 0,
    nombreUsuario: "",
    email: "",
  });
  const [rutinas, setRutinas] = useState<RutinaAsignada[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEjercicio, setselectedEjercicio] =
    useState<RutinaAsignada | null>(null);

  const fetchRutinaUsuario = async () => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = userData.idUsuario;
    setUser(userData);

    try {
      const response = await fetch(`${API_URL}/rutinasUsuarios/${userId}`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.json();
      console.log(data.body.rutinas);
      setRutinas(data.body.rutinas);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRutinaUsuario();
  }, []);

  const openModal = (exercise: RutinaAsignada) => {
    setselectedEjercicio(exercise);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setselectedEjercicio(null);
  };

  return (
    <>
      <header>
        <NavBar></NavBar>
      </header>
      <main>
        <div className="subtitle">
          <h2 className="subtitle-h2">Rutina de {user.nombreUsuario}</h2>
        </div>
        <div className="contenido-container">
          {rutinas.length === 0 ? (
            <h2 className="center">No se ha asignado ninguna rutina.</h2>
          ) : (
            <>
              <p className="detalles-rutina">
                <strong>Notas:</strong> {rutinas[0].notas}
              </p>
              {rutinas.map((ejercicio, index) => (
                <div
                  key={`${ejercicio.idEjercicio}+${index}`}
                  className="contenedor-rutinas"
                >
                  {index === 0 ||
                  rutinas[index - 1].idRutina !== ejercicio.idRutina ? (
                    <div className="encabezado">
                      <div className="titulos-encabezado">
                        <h2>Rutina:</h2>
                        <p className="nombre-rutina">
                          {ejercicio.nombreRutina}
                        </p>
                        <h2>Ejercicios</h2>
                      </div>
                    </div>
                  ) : null}
                  <ul>
                    <li className="ejercicios-rutinas">
                      <div>
                        <strong>{ejercicio.nombreEjercicio}</strong>
                        <p>Series y repeticiones: {ejercicio.seriesReps}</p>
                        <button
                          className="ver-ejercicio-btn"
                          onClick={() => openModal(ejercicio)}
                        >
                          Ver ejercicio
                        </button>
                      </div>
                    </li>
                  </ul>
                </div>
              ))}
            </>
          )}
        </div>
      </main>
      <ModalHU isOpen={modalOpen} onClose={closeModal}>
        {selectedEjercicio && (
          <div className="detalles-ejercicio">
            <h3>{selectedEjercicio.nombreEjercicio}</h3>
            <p>
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
            <p>
              <strong>Instrucciones:</strong>
            </p>
            <ul>
              {selectedEjercicio.instrucciones.map((instruccion, index) => (
                <li key={index}>{instruccion}</li>
              ))}
            </ul>
            {selectedEjercicio.imgUrl && (
              <div className="contenedor-imagen">
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
    </>
  );
}
