import { ValidationChain, body } from 'express-validator';
import User from '../models/User';

export const validateSignupInputs: ValidationChain[] = [
    body('email')
        .notEmpty()
        .withMessage('Email field is required')
        .isEmail()
        .withMessage('Wrong email format')
        .custom(async (email: string): Promise<boolean> => {
            const user = await User.findOne({ email: email });
            if (user) {
                throw new Error('E-Mail exists already');
            }
            return true;
        }),

    body('password')
        .notEmpty()
        .withMessage('Password field is required')
        .isLength({ min: 8 })
        .withMessage('Password must have at least 8 characters')
        .trim(),

    body('confirmPassword')
        .notEmpty()
        .withMessage('Confirm password field is required')
        .trim()
        .custom((confirmPassword: string, { req }): boolean => {
            if (confirmPassword !== req.body.password) {
                throw new Error("Passwords doesn't match!");
            }
            return true;
        }),
];

export const validateLoginInputs: ValidationChain[] = [
    body('email')
        .notEmpty()
        .withMessage('Email field is required')
        .isEmail()
        .withMessage('Wrong email format'),

    body('password')
        .notEmpty()
        .withMessage('Password field is required')
        .isLength({ min: 8 })
        .withMessage('Password must have at least 8 characters')
        .trim(),
];
