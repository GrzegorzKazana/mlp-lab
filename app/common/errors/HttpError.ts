import { AppError } from './AppError';

export class HttpError extends AppError {
    constructor(public readonly status: number, originalError: unknown, message: string) {
        super('HttpError', originalError, message);
    }
}

export const createHttpError = (
    status: number,
    originalError: unknown,
    message = 'Failed to execute http request',
): HttpError => new HttpError(status, originalError, message);
