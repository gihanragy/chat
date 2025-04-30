import { Message } from '../models/Message';
import { PaginationOptions, PaginatedResult, CreateMessageInput } from '../types';

export class ChatService {
  static async createMessage(input: CreateMessageInput) {
    const message = new Message(input);
    return await message.save();
  }

  static async getMessagesByEntity(
    entityType: string,
    entityId: string,
    options: PaginationOptions
  ): Promise<PaginatedResult<typeof Message>> {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      Message.find({ entityType, entityId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      Message.countDocuments({ entityType, entityId })
    ]);

    return {
      data: messages,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }
}