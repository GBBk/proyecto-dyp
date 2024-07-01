import { API_URL } from "../../auth/constants";
import "../../stylesheets/tables.css";
import NavBarAdmin from "../../components/NavBarAdmin.tsx";
import { useEffect, useState } from "react";
import { type Usuarios } from "../../types/types.ts";
import { parseISO, isWithinInterval } from "date-fns";

interface MembresiaActiva {
  idUsuario: number;
  fechaAsignacion: string;
  fechaVencimiento: string;
}

export default function AUsers() {
  const [users, setUsers] = useState<Usuarios[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [memberships, setMemberships] = useState<MembresiaActiva[]>([]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/usersAdmin`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });
      if (!response.ok) {
        throw new Error("Hubo un problema al obtener los datos.");
      }
      const data = await response.json();
      setUsers(data.body.users);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  const fetchMemberships = async () => {
    try {
      const response = await fetch(`${API_URL}/membresiaActiva`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });
      if (!response.ok) {
        throw new Error("Hubo un problema al obtener los datos.");
      }
      const data = await response.json();
      const formattedData = data.body.membresiaActiva.map(
        (membresia: MembresiaActiva) => ({
          ...membresia,
          fechaAsignacion: formatDate(membresia.fechaAsignacion),
          fechaVencimiento: formatDate(membresia.fechaVencimiento),
        })
      );
      setMemberships(formattedData);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchMemberships();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const getMembershipStatus = (userId: number) => {
    const membership = memberships.find((m) => m.idUsuario === userId);
    if (membership) {
      const now = new Date();
      const start = parseISO(membership.fechaAsignacion);
      const end = parseISO(membership.fechaVencimiento);
      const isActive = isWithinInterval(now, { start, end });

      return isActive ? "Activa" : "Inactiva";
    }
    return "Sin membresía";
  };

  const filteredUsers = users.filter((user) =>
    user.nombreUsuario.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <header>
        <NavBarAdmin />
      </header>
      <main>
        <div className="subtitle">
          <h2 className="subtitle-h2">Usuarios</h2>
        </div>
        <div className="search-bar-user">
          <label>Buscar usuario</label>
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <table className="table-desktop">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Edad</th>
              <th>DNI</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>Membresía</th>
              <th>Plan</th>
              <th>Notas</th>
              <th>Objetivo</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.idUsuario}>
                <td>{user.idUsuario}</td>
                <td>{user.nombreUsuario}</td>
                <td>{user.edad}</td>
                <td>{user.dni}</td>
                <td>{user.email}</td>
                <td>{user.telefono}</td>
                <td>{user.direccion}</td>

                <td>
                  <p
                    className={
                      getMembershipStatus(user.idUsuario) === "Activa"
                        ? "activa"
                        : "inactiva"
                    }
                  >
                    {getMembershipStatus(user.idUsuario)}
                  </p>
                </td>
                <td>{user.membresia}</td>
                <td>{user.notas}</td>
                <td>{user.objetivo ? user.objetivo : "Sin especificar"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </>
  );
}

const formatDate = (dateString: string) => {
  return dateString;
};
