import { API_URL } from "../../auth/constants";
import { useState, useEffect } from "react";
import NavBarAdmin from "../../components/NavBarAdmin";
import SuccessMessage from "../../components/SuccessMessage";
import { fetchUsuarios } from "../../services/constants";
import { User, Rutina } from "../../types/types";

export default function AsignarRutina() {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [rutinas, setRutinas] = useState<Rutina[]>([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<number>(0);
  const [rutinasSeleccionadas, setRutinasSeleccionadas] = useState<number[]>(
    []
  );
  const [notas, setNotas] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchRutinas = async () => {
    try {
      const response = await fetch(`${API_URL}/asignarRutina`, {
        headers: { "ngrok-skip-browser-warning": "true" },
      });
      if (!response.ok) {
        throw new Error("Hubo un problema al obtener los datos de rutinas.");
      }
      const data = await response.json();
      setRutinas(data.body.rutinas);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAsignarRutinasSubmit = async (
    e: React.ChangeEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/asignarRutina`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          usuario: usuarioSeleccionado,
          rutinas: rutinasSeleccionadas,
          notas: notas,
        }),
      });
      if (!response.ok) {
        setSuccessMessage("Error al asignar rutinas");
        throw new Error("Hubo un problema al asignar las rutinas.");
      }
      const data = await response.json();
      console.log(data);

      setSuccessMessage("Rutinas asignadas con éxito!");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsuarios(setUsuarios);
    fetchRutinas();
  }, []);

  return (
    <>
      <header>
        <NavBarAdmin />
      </header>
      <main>
        <div className="subtitle">
          <h2 className="subtitle-h2">Asignar Rutina</h2>
        </div>
        <div className="contenido-container">
          {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
          <form
            className="ar-container"
            onSubmit={handleAsignarRutinasSubmit}
            id="asignarRutinasForm"
          >
            <label className="ejercicio-rutina">Seleccionar Usuario:</label>
            <div className="select-container">
              <select
                id="select"
                name="usuario"
                required
                value={usuarioSeleccionado}
                onChange={(e) =>
                  setUsuarioSeleccionado(parseInt(e.target.value))
                }
              >
                <option value="">Seleccione un usuario</option>
                {usuarios.map((usuario, index) => (
                  <option
                    value={usuario.idUsuario}
                    key={`${usuario.idUsuario}+${index}`}
                  >
                    {usuario.nombreUsuario}
                  </option>
                ))}
              </select>
            </div>
            <label className="ejercicio-rutina">Seleccionar Rutinas:</label>
            <div className="select-container">
              <select
                id="select"
                name="rutinas"
                multiple
                required
                onChange={(e) =>
                  setRutinasSeleccionadas(
                    Array.from(e.target.selectedOptions, (option) =>
                      parseInt(option.value)
                    )
                  )
                }
              >
                {rutinas.map((rutina, index) => (
                  <option
                    value={rutina.idRutina}
                    key={`${rutina.idRutina}+${index}`}
                  >
                    {rutina.nombreRutina}
                  </option>
                ))}
              </select>
            </div>

            <label className="ejercicio-rutina">Notas:</label>
            <textarea
              className="ejercicio-rutina"
              id="notas"
              name="notas"
              value={notas}
              onChange={(e) => setNotas(e.currentTarget.value)}
            ></textarea>

            <button className="form__submit mt9" type="submit">
              Asignar Rutinas
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
