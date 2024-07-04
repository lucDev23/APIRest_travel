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
    // const errors: Result = validationResult(req);

    // if (!errors.isEmpty()) {
    //     const error = new CustomValidationError(errors.array());
    //     res.status(422);
    //     return next(error);
    // }

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
    // const errors: Result = validationResult(req);

    // if (!errors.isEmpty()) {
    //     const error = new CustomValidationError(errors.array());
    //     res.status(422);
    //     return next(error);
    // }

    const { email, password } = req.body as { email: string; password: string };

    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            const error: Error = new Error(
                'A user with this email could not be found.'
            );
            res.status(401);
            return next(error);
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (!passwordsMatch) {
            const error: Error = new Error('Wrong password.');
            res.status(401);
            return next(error);
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
