import React, { useState } from "react";
import ListaUsuarios from "./ListaUsuarios";
import Chat from "./Chat";
import { useAuth } from "../auth/useAuth";
import "../stylesheets/chat.css";

const ChatInterface: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const { user } = useAuth();
  const currentUserId = user.idUsuario;
  console.log(currentUserId);

  const handleUserSelect = (userId: number) => {
    setSelectedUser(userId);
  };

  return (
    <div className="chat-interface">
      <div className="usuario-lista">
        <ListaUsuarios onSelectUser={handleUserSelect} />
      </div>
      <div className="chat-area">
        {selectedUser && (
          <Chat userId={currentUserId} receiverId={selectedUser} />
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
