import { Request, Response, NextFunction } from 'express';
import { Result, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import Trip from '../models/Trip';
import Bus from '../models/Bus';
import { Location } from '../models/Location';
import { CustomValidationError } from '../types/CustomValidationError';

export const createTrip = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { departureDate, arrivalDate, origin, destination, bus } =
        req.body as {
            departureDate: string;
            arrivalDate: string;
            origin: string;
            destination: string;
            bus: string;
        };

    return res.json({ message: 'ok' });
};
