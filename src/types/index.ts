export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateMessageInput {
  entityType: string;
  entityId: string;
  message: string;
  senderId: string;
}