import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/User';
import { IUser } from '../interfaces/IUser';

export const postSignup = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error(errors.array()[0].msg);
        res.status(422);
        return next(error);
    }

    const email = req.body.email;
    const password = req.body.password;

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

export const postLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error(errors.array()[0].msg);
        res.status(422);
        return next(error);
    }

    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            const error = new Error(
                'A user with this email could not be found.'
            );
            res.status(401);
            return next(error);
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (!passwordsMatch) {
            const error = new Error('Wrong password.');
            res.status(401);
            return next(error);
        }

        return res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        res.status(500);
        return next(error);
    }
};
