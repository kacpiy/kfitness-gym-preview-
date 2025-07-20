import dotenv from 'dotenv';
dotenv.config();

import io from 'socket.io-client';
import { handleSocketAction } from './service';

const socket = io(process.env.SOCKET_URL, {
  path: '/socket.io',
  query: {
    token: process.env.WS_TOKEN
  },
  transports: ['websocket']
});

socket.on('connect', () => {
  console.log('Connected to WebSocket server via socket.io');
  socket.emit('identify', { gymId: +process.env.LOCATION_ID, gymName: process.env.LOCATION_NAME });
});

socket.on('action', (message) => {
  console.log('Received message from server:', message);
  handleSocketAction(message);
});

socket.on('disconnect', () => {
  console.log('Disconnected from WebSocket server');
});

socket.on('connect_error', (error) => {
  console.error('WebSocket error:', error);
});