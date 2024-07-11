import { Request, Response, NextFunction } from 'express';
import { Result, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { CustomError } from '../types/CustomError';

const SECRET_KEY = 'secret_key';

export const signup = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { email, password } = req.body as { email: string; password: string };

    try {
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new User({
            email: email,
            password: hashedPassword,
        });

        const result = await user.save();

        return res
            .status(201)
            .json({ message: 'User created!', userId: result._id });
    } catch (error) {
        res.status(500);
        return next(error);
    }
};

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { email, password } = req.body as { email: string; password: string };

    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            const errors: CustomError = new CustomError();

            errors.addError(email, 'There is no user with that email', 'email');
            res.status(401);
            return next(errors);
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (!passwordsMatch) {
            const errors: CustomError = new CustomError();

            errors.addError(password, 'Wrong password', 'password');
            res.status(401);
            return next(errors);
        }

        const payload = { _id: user._id };
        const token: string = jwt.sign(payload, SECRET_KEY, {
            expiresIn: '1h',
        });
        return res
            .status(200)
            .json({ message: 'successfully logged in', token });
    } catch (error) {
        res.status(500);
        return next(error);
    }
};

export const test = (req: Request, res: Response, next: NextFunction) => {
    return res.json({ message: 'ok' });
};
