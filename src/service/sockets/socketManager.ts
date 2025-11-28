import { io } from "socket.io-client";

const url = import.meta.env.VITE_SOCKET_URL;
if (!url) {
  throw new Error("VITE_SOCKET_URL no está definido");
}

export const socket = io(url, { autoConnect: true });

export const disconnectSocket = () => {
  socket.disconnect();
};