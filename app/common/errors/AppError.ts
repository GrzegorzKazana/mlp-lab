export class AppError extends Error {
    constructor(
        public readonly name: string,
        public readonly originalError: unknown,
        message: string,
    ) {
        super(message);
    }

    public toJSON(): Record<string, unknown> {
        return {
            name: this.name,
            message: this.message,
            originalError:
                this.originalError instanceof Error
                    ? {
                          message: this.originalError.message,
                          stack: this.originalError.stack,
                      }
                    : this.originalError,
        };
    }
}

export const appError = (message: string, error?: unknown): AppError =>
    new AppError('AppError', error, message);
