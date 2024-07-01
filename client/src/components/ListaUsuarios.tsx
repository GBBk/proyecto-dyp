import React, { useEffect, useState } from "react";
import { fetchUsuarios } from "../services/constants.ts";
import "../stylesheets/chat.css";

interface IUsuario {
  idUsuario: number;
  nombreUsuario: string;
}

interface ListaUsuariosProps {
  onSelectUser: (userId: number) => void;
}

const ListaUsuarios: React.FC<ListaUsuariosProps> = ({ onSelectUser }) => {
  const [users, setUsers] = useState<IUsuario[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  useEffect(() => {
    fetchUsuarios(setUsers);
  }, []);

  const handleUserClick = (userId: number) => {
    onSelectUser(userId);
    setSelectedUserId(userId); // Actualiza el estado con el usuario seleccionado
  };

  return (
    <div className="usuario-lista">
      <h3>Usuarios</h3>
      <ul>
        {users.map((user) => (
          <li
            key={user.idUsuario}
            onClick={() => handleUserClick(user.idUsuario)}
            className={selectedUserId === user.idUsuario ? "selected" : ""}
          >
            {user.nombreUsuario}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaUsuarios;
