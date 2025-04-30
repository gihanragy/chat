import { Request, Response } from 'express';
import { ChatService } from '../services/chatService';
import { WebSocketController } from './websocketController';
import { PaginationOptions, CreateMessageInput } from '../types';

export class MessageController {
  constructor(private wsController: WebSocketController) {}

  async createMessage(req: Request, res: Response) {
    try {
      const input: CreateMessageInput = req.body;
      const message = await ChatService.createMessage(input);

      // Broadcast the new message to the appropriate room
      this.wsController.broadcastToRoom(
        input.entityType,
        input.entityId,
        { type: 'new_message', message }
      );

      res.status(201).json(message);
    } catch (error) {
      console.error('Error creating message:', error);
      res.status(500).json({ error: 'Failed to create message' });
    }
  }

  async getMessagesByEntity(req: Request, res: Response) {
    try {
      const { entityType, entityId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const options: PaginationOptions = { page, limit };
      const result = await ChatService.getMessagesByEntity(entityType, entityId, options);

      res.json(result);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  }
}