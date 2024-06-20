import { Request, Response, NextFunction } from 'express';
import { Result, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import Trip from '../models/Trip';
import Bus from '../models/Bus';
import { Location } from '../models/Location';

export const createTrip = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors: Result = validationResult(req);

    if (!errors.isEmpty()) {
        const error = new Error(errors.array()[0].msg);
        res.status(422);
        return next(error);
    }

    return res.json({ message: 'ok' });
};
