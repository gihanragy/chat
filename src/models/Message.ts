import { Schema, model, Document } from 'mongoose';

export interface IMessage extends Document {
  entityType: string;
  entityId: string;
  message: string;
  senderId: string;
  createdAt: Date;
}

const messageSchema = new Schema<IMessage>({
  entityType: { type: String, required: true },
  entityId: { type: String, required: true },
  message: { type: String, required: true },
  senderId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Message = model<IMessage>('Message', messageSchema);
