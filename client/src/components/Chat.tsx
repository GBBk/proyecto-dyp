import React, { useEffect, useState, useRef } from "react";
import { format } from "date-fns";
import socket from "../socket";
import { API_URL } from "../auth/constants";
import "../stylesheets/chat.css";

interface Message {
  id_mensaje: number;
  senderId: number;
  receiverId: number;
  content: string;
  timestamp: string;
  isSent: boolean;
}

interface ChatProps {
  userId: number;
  receiverId: number;
}

const Chat: React.FC<ChatProps> = ({ userId, receiverId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const scrollableRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.emit("joinRoom", userId);

    const fetchChatHistory = async () => {
      try {
        const response = await fetch(
          `${API_URL}/chat/history/${userId}/${receiverId}`,
          {
            headers: {
              "ngrok-skip-browser-warning": "true",
            },
          }
        );
        const data = await response.json();

        const processedMessages: Message[] = data
          .map((message: any) => {
            if (message.sender_id !== undefined) {
              return {
                id_mensaje: message.id,
                senderId: message.sender_id,
                receiverId: message.receiver_id,
                content: message.content,
                timestamp: message.timestamp,
                isSent: false,
              };
            } else {
              console.error("senderId is undefined in message:", message);
              return null;
            }
          })
          .filter(Boolean);

        setMessages(processedMessages);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }

      if (scrollableRef.current) {
        scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
      }
    };

    fetchChatHistory();

    socket.on("receiveMessage", (message: Message) => {
      if (message.receiverId === userId || message.senderId === userId) {
        setMessages((prevMessages) => {
          if (
            prevMessages.some((msg) => msg.id_mensaje === message.id_mensaje)
          ) {
            return prevMessages;
          }
          return [...prevMessages, message];
        });
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [userId, receiverId]);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const message: Message = {
      id_mensaje: messages.length + 1,
      senderId: userId,
      receiverId: receiverId,
      content: newMessage,
      timestamp: new Date().toISOString(),
      isSent: true,
    };

    socket.emit("sendMessage", message);
    setMessages((prevMessages) => [...prevMessages, message]);
    setNewMessage("");
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="chat-area">
      <div ref={scrollableRef} className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            ref={index === messages.length - 1 ? lastMessageRef : null}
            className={`message ${
              msg.senderId === userId ? "my-message" : "their-message"
            }`}
          >
            <span className="timestamp">
              {format(new Date(msg.timestamp), "dd/MM/yyyy HH:mm")}
            </span>
            <p>{msg.content}</p>
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button onClick={handleSendMessage}>Enviar</button>
      </div>
    </div>
  );
};

export default Chat;
