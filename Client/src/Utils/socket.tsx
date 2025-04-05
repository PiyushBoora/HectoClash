import { io } from "socket.io-client";
import { BASE_URL } from "./axios";

const socket = io(BASE_URL); // Replace with your backend URL if deployed

export default socket;
