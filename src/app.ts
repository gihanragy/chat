import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import { createMessageRoutes } from './routes/messageRoutes';
import { WebSocketController } from './controllers/websocketController';

export const createApp = () => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(bodyParser.json());

  // Connect to MongoDB
  mongoose.connect('mongodb://localhost:27017/chat-service')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

  // Create WebSocket controller
  const server = app.listen(0); // Temporary server for WS controller
  const wsController = new WebSocketController(server);
  server.close(); // Close temporary server

  // Routes
  app.use('/api/messages', createMessageRoutes(wsController));

  return { app, wsController };
};
