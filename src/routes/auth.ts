import express, { Request } from 'express';
import * as authController from '../controllers/auth';
import { body } from 'express-validator';
import User from '../models/User';

const router = express.Router();

router.post(
    '/signup',
    [
        body(
            ['email', 'password', 'confirmPassword'],
            'All fields are required'
        ).notEmpty(),

        body('email', 'Please enter a valid email address')
            .isEmail()
            .custom(async (email: string) => {
                const user = await User.findOne({ email: email });
                if (user) {
                    throw new Error('E-Mail exists already');
                }
            }),

        body('password', 'Password must have at least 8 characters')
            .isLength({ min: 8 })
            .trim(),

        body('confirmPassword')
            .trim()
            .custom((confirmPassword: string, { req }) => {
                if (confirmPassword !== req.body.password) {
                    throw new Error("Passwords doesn't match!");
                }
                return true;
            }),
    ],
    authController.postSignup
);

router.post(
    '/login',
    [
        body(['email', 'password'], 'All fields are required').notEmpty(),
        body('email', 'Please enter a valid email address.').isEmail(),
        body('password', 'Password must have at least 8 characters')
            .isLength({ min: 8 })
            .trim(),
    ],
    authController.postLogin
);

export default router;
