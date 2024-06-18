import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

export const postRegister = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const user = new User({ email: 'test2', password: 'test' });
    await user.save();
    return res.json({ message: 'User saved' });
};

// DELETE
