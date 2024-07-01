import { Request, Response, NextFunction } from 'express';
import { Result, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { Location, isLocationInBetween } from '../models/Location';
import { CustomValidationError } from '../types/CustomValidationError';
import { Trip } from '../models/Trip';
import { insertEdge } from '../models/Edge';

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

    const trip = new Trip({
        departureDate: departureDate,
        arrivalDate: arrivalDate,
        origin: origin,
        destination: destination,
        middleDestinations: middleDestinations,
        busId: busId,
    });

    return res.json({ message: 'ok' });
};

export const addLocation = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const errors: CustomValidationError = new CustomValidationError();

    const name = req.body.locationName;

    if (!(await Location.exists({ name: name }))) {
        const location = new Location({ name: name });
        await location.save();
    } else {
        return res.json({ message: 'Location duplicated' });
    }

    return res.json({ message: 'ok' });
};

export const connectLocations = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // const locationOne = req.body.locationOne;
    // const locationTwo = req.body.locationTwo;

    // await insertEdge(locationOne, locationTwo);

    const connect = await isLocationInBetween('Dolores', 'Montevideo', [
        'Ombues',
        'Colonia',
    ]);

    return res.json({ message: connect /* message: 'ok' */ });
};
