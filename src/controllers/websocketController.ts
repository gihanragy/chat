import http from 'node:http';
import WebSocket, { WebSocketServer } from 'ws';

export class WebSocketController {
  private wss: WebSocketServer;
  private clients: Set<WebSocket> = new Set();
  private roomSubscriptions: Map<string, Set<WebSocket>> = new Map();

  constructor(server: any) {
    this.wss = new WebSocketServer({ server });
    this.setupWebSocket();
  }

  private setupWebSocket() {
    this.wss.on('connection', (ws: WebSocket) => {
      this.clients.add(ws);

      ws.on('message', (message: string) => {
        try {
          const data = JSON.parse(message);
          if (data.type === 'subscribe') {
            this.handleSubscribe(ws, data.entityType, data.entityId);
          } else if (data.type === 'unsubscribe') {
            this.handleUnsubscribe(ws, data.entityType, data.entityId);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      });

      ws.on('close', () => {
        this.clients.delete(ws);
        this.removeClientFromAllRooms(ws);
      });
    });
  }

  private getRoomKey(entityType: string, entityId: string): string {
    return `${entityType}:${entityId}`;
  }

  private handleSubscribe(ws: WebSocket, entityType: string, entityId: string) {
    const roomKey = this.getRoomKey(entityType, entityId);
    
    if (!this.roomSubscriptions.has(roomKey)) {
      this.roomSubscriptions.set(roomKey, new Set());
    }
    
    this.roomSubscriptions.get(roomKey)?.add(ws);
  }

  private handleUnsubscribe(ws: WebSocket, entityType: string, entityId: string) {
    const roomKey = this.getRoomKey(entityType, entityId);
    this.roomSubscriptions.get(roomKey)?.delete(ws);
  }

  private removeClientFromAllRooms(ws: WebSocket) {
    for (const [_, clients] of this.roomSubscriptions) {
      clients.delete(ws);
    }
  }

  public broadcastToRoom(entityType: string, entityId: string, message: any) {
    const roomKey = this.getRoomKey(entityType, entityId);
    const clients = this.roomSubscriptions.get(roomKey);

    if (clients) {
      const messageString = JSON.stringify(message);
      clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(messageString);
        }
      });
    }
  }

  public attachServer(server: http.Server) {
    this.wss = new WebSocketServer({ server });
    this.setupWebSocket();
  }
}
