import { API_URL } from "../../auth/constants";
import { useState, useEffect } from "react";
import NavBarAdmin from "../../components/NavBarAdmin";
import ListaUsuarios from "../../components/ListaUsuarios";
import "../../stylesheets/rutinasUsuarios.css";
import ModalHU from "../../components/ModalHU";

interface RutinaUsuario {
  idRutina: number;
  nombreRutina: string;
  ejercicios: Ejercicio[];
  notas: string;
}

interface Ejercicio {
  idEjercicio: number;
  nombreEjercicio: string;
  imgUrl: string | undefined;
  seriesReps: string;
}

export default function RutinasUsuarios() {
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [rutinas, setRutina] = useState<RutinaUsuario[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEjercicio, setselectedEjercicio] =
    useState<Ejercicio | null>();

  const fetchRutinaUsuario = async (userId: number) => {
    try {
      const response = await fetch(`${API_URL}/verRutinaUsuario/${userId}`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });
      const data = await response.json();
      const rutinasMap: { [key: number]: RutinaUsuario } = {};

      data.body.rutina.forEach((item: any) => {
        if (!rutinasMap[item.idRutina]) {
          rutinasMap[item.idRutina] = {
            idRutina: item.idRutina,
            nombreRutina: item.nombreRutina,
            ejercicios: [],
            notas: item.notas,
          };
        }
        rutinasMap[item.idRutina].ejercicios.push({
          idEjercicio: item.idEjercicio,
          nombreEjercicio: item.nombreEjercicio,
          imgUrl: item.imgUrl,
          seriesReps: item.seriesReps,
        });
      });

      setRutina(Object.values(rutinasMap));
    } catch (error) {
      console.error(error);
    }
  };

  const mostrarRutina = (idUsuario: number) => {
    setSelectedUser(idUsuario);
  };

  useEffect(() => {
    if (selectedUser !== null) {
      fetchRutinaUsuario(selectedUser);
    }
  }, [selectedUser]);

  const openModal = (exercise: Ejercicio) => {
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
        <NavBarAdmin />
      </header>
      <main>
        <div className="subtitle">
          <h2 className="subtitle-h2">Rutinas Usuarios</h2>
        </div>
        <div className="space-between">
          <div className="lista-usuarios">
            <ListaUsuarios onSelectUser={mostrarRutina}></ListaUsuarios>
          </div>
          <div className="contenido-container-rusers">
            {rutinas.length === 0 ? (
              <p className="center">No se ha asignado ninguna rutina.</p>
            ) : (
              rutinas.map((rutina) => (
                <div key={rutina.idRutina} className="contenedor-rutinas">
                  <div className="encabezado">
                    <div className="titulos-encabezado">
                      <h2>Rutina:</h2>
                      <p className="nombre-rutina">{rutina.nombreRutina}</p>
                      <h2>Ejercicios</h2>
                    </div>
                  </div>
                  <p className="detalles-rutina">
                    <strong>Notas:</strong> {rutina.notas}
                  </p>
                  <ul>
                    {rutina.ejercicios.map((ejercicio) => (
                      <li
                        key={ejercicio.idEjercicio}
                        className="ejercicios-rutinas"
                      >
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
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
          <ModalHU isOpen={modalOpen} onClose={closeModal}>
            {selectedEjercicio && (
              <img
                className="imagen-ejercicio"
                src={selectedEjercicio.imgUrl}
                alt="Imagen del ejercicio"
              />
            )}
          </ModalHU>
        </div>
      </main>
    </>
  );
}
