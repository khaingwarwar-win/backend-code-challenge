export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly details?: unknown
  ) {
    super(message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Task not found") {
    super(message, 404);
  }
}

