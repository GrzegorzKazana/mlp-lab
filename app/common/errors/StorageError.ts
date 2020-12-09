import { AppError } from './AppError';

export class StorageError extends AppError {
    constructor(public readonly originalError: unknown, message: string) {
        super('StorageError', originalError, message);
    }
}

export const createStorageError = (
    originalError: unknown,
    message = 'Failed to handle operation on storage',
): StorageError => new StorageError(originalError, message);
