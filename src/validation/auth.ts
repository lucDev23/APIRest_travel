import User from '../models/User';
import { Request, Response, NextFunction } from 'express';
import validator from 'validator';
import { CustomError } from '../types/CustomError';

export const validateSignupInputs = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const email: string = validator.trim(req.body.email || '');

    const password: string = validator.trim(req.body.password || '');

    const confirmPassword: string = validator.trim(
        req.body.confirmPassword || ''
    );

    const errors: CustomError = new CustomError();

    if (!email) {
        errors.addError(email, 'Email is required', 'email');
    } else {
        if (!validator.isEmail(email)) {
            errors.addError(email, 'Wrong email format', 'email');
        }

        if (await User.findOne({ email: email })) {
            errors.addError(email, 'E-Mail exists already', 'email');
        }
    }

    if (!password) {
        errors.addError(password, 'Password is required', 'password');
    } else {
        if (password.length < 10) {
            errors.addError(
                password,
                'Password must have at least 10 characters',
                'password'
            );
        }
    }

    if (!confirmPassword) {
        errors.addError(
            confirmPassword,
            'Confirm password is required',
            'confirmPassword'
        );
    } else {
        if (confirmPassword !== password) {
            errors.addError(
                confirmPassword,
                'Passwords does not match',
                'confirmPassword'
            );
        }
    }

    if (errors.errors.length > 0) {
        res.status(422);
        return next(errors);
    }

    req.body.email = validator.normalizeEmail(email);
    req.body.password = password;

    return next();
};

export const validateLoginInputs = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const email: string = validator.trim(req.body.email || '');

    const password: string = validator.trim(req.body.password || '');

    const errors: CustomError = new CustomError();

    if (!email) {
        errors.addError(email, 'Email is required', 'email');
    } else {
        if (!validator.isEmail(email)) {
            errors.addError(email, 'Wrong email format', 'email');
        }
    }

    if (!password) {
        errors.addError(password, 'Password is required', 'password');
    }

    req.body.email = validator.normalizeEmail(email);
    req.body.password = password;

    return next();
};
