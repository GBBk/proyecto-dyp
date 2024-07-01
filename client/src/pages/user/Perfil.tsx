import NavBar from "../../components/NavBar";
import NavBarAdmin from "../../components/NavBarAdmin";
import "../../stylesheets/perfil.css";
import { Usuarios } from "../../types/types"; // Modifiqué la importación para usar la interfaz Usuarios
import { useState, useEffect } from "react";
import { API_URL } from "../../auth/constants";
import { useAuth } from "../../auth/useAuth";
import SuccessMessage from "../../components/SuccessMessage";

export default function Perfil() {
  const [successMessage, setSuccessMessage] = useState<string>("");
  const { isAdmin } = useAuth();
  const [user, setUser] = useState<Usuarios>({
    idUsuario: 0,
    nombreUsuario: "",
    email: "",
    edad: 0,
    dni: 0,
    telefono: 0,
    direccion: "",
    notas: "",
    membresia: "",
    objetivo: "",
  });

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = userData.idUsuario;

    try {
      const response = await fetch(`${API_URL}/user/${userId}`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });
      if (!response.ok) {
        throw new Error("Hubo un problema al obtener los datos.");
      }
      const data = await response.json();
      setUser(data.body.user);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  const handleSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = userData.idUsuario;

    try {
      const response = await fetch(`${API_URL}/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        throw new Error("Hubo un problema al actualizar los datos.");
      }
      setSuccessMessage("Cambios guardados correctamente!");
    } catch (error) {
      console.error("Error al actualizar los datos:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]:
        name === "edad" || name === "dni" || name === "telefono"
          ? parseInt(value)
          : value,
    }));
  };

  return (
    <>
      <header>{isAdmin ? <NavBarAdmin /> : <NavBar />}</header>
      <main>
        <div className="subtitle">
          <h2 className="subtitle-h2">Perfil de {user.nombreUsuario} </h2>
        </div>
        <div className="contenido-container">
          {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
          <ul>
            <li>
              <strong>Email:</strong> {user.email}
            </li>
          </ul>
          <ul>
            <li>
              <strong>Membresía:</strong> {user.membresia}
            </li>
          </ul>
          <div className="perfil__info">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Edad:</label>
                <input
                  type="number"
                  name="edad"
                  autoComplete="off"
                  value={user.edad || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>DNI:</label>
                <input
                  type="number"
                  name="dni"
                  autoComplete="off"
                  value={user.dni || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Teléfono:</label>
                <input
                  type="number"
                  name="telefono"
                  autoComplete="off"
                  value={user.telefono || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Dirección:</label>
                <input
                  type="text"
                  name="direccion"
                  autoComplete="off"
                  value={user.direccion}
                  onChange={handleChange}
                />
              </div>
              <div className="perfil__group">
                <label>Objetivo:</label>
                <input
                  type="text"
                  name="objetivo"
                  autoComplete="off"
                  value={user.objetivo}
                  onChange={handleChange}
                />
              </div>
              <div className="perfil__group">
                <label>Notas:</label>
                <input
                  type="text"
                  name="notas"
                  autoComplete="off"
                  value={user.notas}
                  onChange={handleChange}
                />
              </div>
              <button className="perfil__submit" type="submit">
                Guardar cambios
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
