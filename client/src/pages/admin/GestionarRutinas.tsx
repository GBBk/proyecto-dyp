import { API_URL } from "../../auth/constants";
import { useState, useEffect } from "react";
import Modal from "react-modal";
import RutinaForm from "./RutinaForm";
import NavBarAdmin from "../../components/NavBarAdmin";
import "../../stylesheets/gestionar_rutina.css";
import { ModificarRutina } from "../../types/types";

export default function GestionarRutinas() {
  const [rutinas, setRutinas] = useState<ModificarRutina[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRutina, setSelectedRutina] = useState<ModificarRutina | null>(
    null
  );

  const fetchRutinas = async () => {
    try {
      const response = await fetch(`${API_URL}/gestionarRutinas`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });
      if (!response.ok) {
        throw new Error("Hubo un problema al obtener los datos.");
      }
      const data = await response.json();
      // Transformar la estructura de los datos para adaptarla al nuevo formato
      const rutinasTransformadas = data.body.rutinas.reduce(
        (acc: ModificarRutina[], curr: any) => {
          let rutina = acc.find((r) => r.idRutina === curr.idRutina);
          if (!rutina) {
            rutina = {
              idRutina: curr.idRutina,
              nombreRutina: curr.nombreRutina,
              ejercicios: [],
            };
            acc.push(rutina);
          }
          rutina.ejercicios.push({
            idEjercicio: curr.idEjercicio,
            nombreEjercicio: curr.nombreEjercicio,
            seriesReps: curr.seriesReps,
          });
          return acc;
        },
        []
      );
      setRutinas(rutinasTransformadas);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRutinas();
  }, []);

  const openModal = (rutina: ModificarRutina) => {
    setSelectedRutina(rutina);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleUpdate = async (updatedRutina: ModificarRutina) => {
    console.log(updatedRutina);
    try {
      const response = await fetch(
        `${API_URL}/gestionarRutinas/rutina/${updatedRutina.idRutina}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify(updatedRutina),
        }
      );
      if (!response.ok) {
        throw new Error("Hubo un problema al actualizar los datos.");
      }
      fetchRutinas();
      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (idRutina: number) => {
    try {
      const response = await fetch(
        `${API_URL}/gestionarRutinas/rutina/${idRutina}`,
        {
          method: "DELETE",
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Hubo un problema al eliminar la rutina.");
      }
      fetchRutinas();
    } catch (error) {
      console.log(error);
    }
  };

  const customStyles = {
    content: {
      maxWidth: "900px",
      height: "minContent",
      margin: "auto",
      backgroundColor: "rgba(239,239,239, 0.5)",
    },
  };

  return (
    <>
      <header>
        <NavBarAdmin />
      </header>
      <main>
        <div className="subtitle">
          <h2 className="subtitle-h2">Gestionar rutinas</h2>
        </div>
        <div className="contenido-container">
          {rutinas.map((rutina) => (
            <div className="contenedor-rutinas" key={rutina.idRutina}>
              <div className="encabezado">
                <div className="titulos-encabezado">
                  <h2>Rutina: </h2>
                  <p className="nombre-rutina">{rutina.nombreRutina}</p>
                  <h2>Ejercicios</h2>
                </div>
                <div className="contenedor-crud">
                  <button
                    className="editar-btn"
                    onClick={() => openModal(rutina)}
                  >
                    Modificar
                  </button>
                  <button
                    className="eliminar-btn"
                    onClick={() => handleDelete(rutina.idRutina)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
              <ul>
                {rutina.ejercicios.map((ejercicio, index) => (
                  <li
                    className="ejercicios-rutinas"
                    key={`${ejercicio.idEjercicio}+${index}`}
                  >
                    <strong>{ejercicio.nombreEjercicio}</strong>
                    <p className="series-repes">
                      Series y repeticiones: {ejercicio.seriesReps}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <Modal
            isOpen={isModalOpen && selectedRutina !== null}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Modificar Rutina"
          >
            {selectedRutina && (
              <RutinaForm
                rutina={selectedRutina}
                onUpdate={handleUpdate}
                onClose={closeModal}
              />
            )}
          </Modal>
        </div>
      </main>
    </>
  );
}
