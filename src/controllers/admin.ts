import { Request, Response, NextFunction } from 'express';
import { Result, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { insertLocation, Location } from '../models/Location';
import { CustomValidationError } from '../types/CustomValidationError';
import { Trip, insertTrip } from '../models/Trip';
import { Edge, insertEdge } from '../models/Edge';
import { insertBus } from '../models/Bus';
import { IEdge } from '../interfaces/IEdge';
import { LocationGraph } from '../types/LocationsGraph';

export const testGraph = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const graph = new LocationGraph();
    await graph.init();
    graph.print();
    console.log(
        await graph.findShortestPathWithIntermediates(
            'Dolores',
            'Montevideo',
            []
        )
    );

    res.json({ message: 'ok' });
};

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

    await insertTrip(
        departureDate,
        arrivalDate,
        origin,
        destination,
        middleDestinations,
        busId
    );

    return res.status(200).json({ message: 'Trip created successfully' });
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
    const distance = req.body.distance;

    try {
        await insertEdge(locationOne, locationTwo, distance);
        return res
            .status(200)
            .json({ message: 'Connection added successfully' });
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
