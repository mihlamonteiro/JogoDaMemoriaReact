import { io } from 'socket.io-client';

// Ajuste a URL se o backend rodar em outro host/porta
export const socket = io('http://localhost:3000');
