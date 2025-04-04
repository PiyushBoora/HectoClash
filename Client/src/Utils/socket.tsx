import { io } from "socket.io-client";

const socket = io("http://localhost:8080"); // Replace with your backend URL if deployed

export default socket;
