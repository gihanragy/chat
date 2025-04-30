import { Router } from 'express';
import { MessageController } from '../controllers/messageController';
import { WebSocketController } from '../controllers/websocketController';

export const createMessageRoutes = (wsController: WebSocketController) => {
  const router = Router();
  const messageController = new MessageController(wsController);

  router.post('/', messageController.createMessage.bind(messageController));
  router.get('/:entityType/:entityId', messageController.getMessagesByEntity.bind(messageController));

  return router;
};
