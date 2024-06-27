import { Bus, existsBus } from '../models/Bus';
import { Trip } from '../models/Trip';
import { Request, Response, NextFunction } from 'express';
import { CustomValidationError } from '../types/CustomValidationError';
import validator from 'validator';
import { existsAllLocations, existsLocation } from '../models/Location';

export const validateTripInputs = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const departureDate: string = validator.trim(req.body.departureDate || '');

    const arrivalDate: string = validator.trim(req.body.arrivalDate || '');

    const origin: string = validator.escape(
        validator.trim(req.body.origin || '')
    );

    const destination: string = validator.escape(
        validator.trim(req.body.destination || '')
    );

    const middleDestinations: string[] = (
        req.body.middleDestinations || []
    ).map((location: string) => validator.escape(validator.trim(location)));

    const busId: string = validator.trim(req.body.busId || '');

    const errors: CustomValidationError = new CustomValidationError();

    req.body.departureDate = departureDate;
    req.body.arrivalDate = arrivalDate;
    req.body.origin = origin;
    req.body.destination = destination;
    req.body.middleDestinations = middleDestinations;
    req.body.busId = busId;

    if (!departureDate) {
        errors.addError(
            departureDate,
            'Departure date is required',
            'departureDate'
        );
    } else {
        if (!validator.isISO8601(departureDate)) {
            errors.addError(
                departureDate,
                'Departure date is in the wrong format',
                'departureDate'
            );
        }
    }

    if (!arrivalDate) {
        errors.addError(arrivalDate, 'Arrival date is required', 'arrivalDate');
    }
    {
        if (!validator.isISO8601(arrivalDate)) {
            errors.addError(
                arrivalDate,
                'Arrival date is in the wrong format',
                'arrivalDate'
            );
        }
    }

    if (!origin) {
        errors.addError(origin, 'Origin is required', 'origin');
    } else {
        const validOrigin = await existsLocation(origin);
        if (!validOrigin) {
            errors.addError(
                origin,
                'Origin location is not a valid option',
                'origin'
            );
        }
    }

    if (!destination) {
        errors.addError(destination, 'Destination is required', 'destination');
    }
    {
        const validDestination = await existsLocation(destination);
        if (!validDestination) {
            errors.addError(
                destination,
                'Destination location is not a valid option',
                'destination'
            );
        }
    }

    if (middleDestinations.length > 0) {
        const invalidLocations = await existsAllLocations(middleDestinations);
        if (invalidLocations.length > 0) {
            invalidLocations.forEach((location) => {
                errors.addError(
                    middleDestinations[middleDestinations.indexOf(location)],
                    `Middle destination '${location}' is not a valid option`,
                    'middleDestinations'
                );
            });
        }
    }

    if (!busId) {
        errors.addError(busId, 'Bus id is required', 'busId');
    } else {
        const validBus = await existsBus(busId);
        if (!validBus) {
            errors.addError(busId, 'There is no bus with that id', 'busId');
        }
    }

    if (errors.errors.length > 0) {
        res.status(422);
        return next(errors);
    }

    return next();
};
