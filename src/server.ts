import http from 'http';
import { createApp } from './app';

const PORT = process.env.PORT || 3000;

const { app, wsController } = createApp();

const server = http.createServer(app);

// Attach WebSocket server to the HTTP server
wsController.attachServer(server);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
