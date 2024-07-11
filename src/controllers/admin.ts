import { Request, Response, NextFunction } from 'express';
import { Result, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { insertLocation, Location } from '../models/Location';
import { CustomError } from '../types/CustomError';
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
    console.log(graph.getWays('Dolores', 'Colonia'));

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
    const middleLocations: string[] = req.body.middleLocations;
    const busId: string = req.body.busId;

    try {
        await insertTrip(
            departureDate,
            arrivalDate,
            origin,
            destination,
            middleLocations,
            busId
        );
        return res.status(200).json({ message: 'Trip created successfully' });
    } catch (error) {
        res.status(500);
        return next(error);
    }
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
        res.status(500);
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
        res.status(500);
        return next(error);
    }
};

export const addBus = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const actualLocationId = await Location.find({
            name: req.body.actualLocation,
        });

        await insertBus(req.body.busCapacity, actualLocationId[0]._id);
        return res.status(200).json({ message: 'Bus added successfully' });
    } catch (error) {
        res.status(500);
        return next(error);
    }
};

export const getRoutes = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const origin: string = req.body.origin;
    const destination: string = req.body.destination;

    const graph = new LocationGraph();
    graph.init();
    const routes = graph.getWays(origin, destination);
    if (routes.length === 0) {
        const error = new CustomError('Not connected');
        error.addError(
            origin,
            `There is no route connection between ${origin} and ${destination}`,
            'origin'
        );
    }
};
