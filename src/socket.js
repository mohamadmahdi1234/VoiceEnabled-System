import { io } from "socket.io-client";
export const socket = io("ws://localhost:3002", {
  path: "/ws/socket.io",
});
