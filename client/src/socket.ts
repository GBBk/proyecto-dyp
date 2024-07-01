import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

const socket: Socket = io(SOCKET_URL, {
  withCredentials: true,
});

export default socket;
