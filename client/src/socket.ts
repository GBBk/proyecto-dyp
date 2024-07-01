import { io, Socket } from "socket.io-client";

const SOCKET_URL = "https://cc8c-200-114-108-236.ngrok-free.app";

const socket: Socket = io(SOCKET_URL, {
  withCredentials: true,
});

export default socket;
