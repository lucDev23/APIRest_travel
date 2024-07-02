import { Request, Response, NextFunction } from 'express';
import { Result, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { insertLocation } from '../models/Location';
import { CustomValidationError } from '../types/CustomValidationError';
import { Trip } from '../models/Trip';
import { insertEdge } from '../models/Edge';
import { insertBus } from '../models/Bus';

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

export const addLocation = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        await insertLocation(req.body.locationName);
        return res.status(200).json({ message: 'Location added successfully' });
    } catch (error) {
        return next(error);
    }
};

export const connectLocations = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const locationOne = req.body.locationOne;
    const locationTwo = req.body.locationTwo;

    const errors: CustomValidationError = new CustomValidationError();
    try {
        if (errors.errors.length > 0) {
            res.status(422);
            return next(errors);
        }

        await insertEdge(locationOne, locationTwo);
        return res
            .status(200)
            .json({ message: 'Conneetion added successfully' });
    } catch (error) {
        return next(error);
    }
};

export const addBus = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        await insertBus(req.body.busCapacity);
        return res.status(200).json({ message: 'Bus added successfully' });
    } catch (error) {
        return next(error);
    }
};
