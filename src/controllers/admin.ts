import { Request, Response, NextFunction } from 'express';
import { Result, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { Location } from '../models/Location';
import { CustomValidationError } from '../types/CustomValidationError';

export const createTrip = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const departureDate: string = req.body.departureDate;
    const arrivalDate: string = req.body.arrivalDate;
    const origin: string = req.body.origin;
    const destination: string = req.body.destination;
    const middleDestinations: string[] = req.body.middleDestinations;
    const busId: string = req.body.busId;

    return res.json({ message: 'ok' });
};
