export class CustomValidationError extends Error {
    errors?: {
        type: string;
        value: string | undefined;
        msg: string;
        path: string;
        location: string;
    }[];
    constructor(
        errors: {
            type: string;
            value: string | undefined;
            msg: string;
            path: string;
            location: string;
        }[]
    ) {
        super('Validation error');
        this.errors = errors;
    }
}
