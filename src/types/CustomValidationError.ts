export class CustomValidationError extends Error {
    errors: {
        value: string | undefined | null;
        msg: string;
        path: string;
    }[];
    constructor() {
        super('Validation error');
        this.errors = [];
    }

    addError(value: string | undefined, msg: string, path: string): void {
        this.errors?.push({
            value: value !== undefined ? value : null,
            msg: msg,
            path: path,
        });
    }
}
