import { AppError } from './AppError';

export class FileSystemError extends AppError {
  constructor(public readonly originalError: unknown, message: string) {
    super('FileSystemError', originalError, message);
  }
}

export const createFileSystemError = (
  originalError: unknown,
  message = 'Failed to handle operation on file system'
): FileSystemError => new FileSystemError(originalError, message);
