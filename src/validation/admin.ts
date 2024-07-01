import { Bus, existsBus } from '../models/Bus';
import { Trip } from '../models/Trip';
import { Request, Response, NextFunction } from 'express';
import { CustomValidationError } from '../types/CustomValidationError';
import validator from 'validator';
import { existsAllLocations, existsLocation } from '../models/Location';
import { validDate } from '../helpers/validDate';

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

    req.body.origin = origin;
    req.body.destination = destination;
    req.body.middleDestinations = middleDestinations;
    req.body.departureDate = departureDate;
    req.body.arrivalDate = arrivalDate;
    req.body.busId = busId;

    if (!origin) {
        errors.addError(origin, 'Origin is required', 'origin');
    } else {
        try {
            const validOrigin = await existsLocation(origin);
            if (!validOrigin) {
                errors.addError(
                    origin,
                    'Origin location is not a valid option',
                    'origin'
                );
            }
        } catch (error) {
            return next(error);
        }
    }

    if (!destination) {
        errors.addError(destination, 'Destination is required', 'destination');
    } else {
        try {
            const validDestination = await existsLocation(destination);
            if (!validDestination) {
                errors.addError(
                    destination,
                    'Destination location is not a valid option',
                    'destination'
                );
            }
        } catch (error) {
            return next(error);
        }
    }

    if (origin === destination) {
        errors.addError(
            origin,
            'Origin must be different from destination',
            'origin'
        );
    }

    if (middleDestinations.length > 0) {
        try {
            const invalidLocations = await existsAllLocations(
                middleDestinations
            );
            if (invalidLocations.length > 0) {
                invalidLocations.forEach((location) => {
                    errors.addError(
                        middleDestinations[
                            middleDestinations.indexOf(location)
                        ],
                        `Middle destination '${location}' is not a valid option`,
                        'middleDestinations'
                    );
                });
            }
        } catch (error) {
            return next(error);
        }
    }

    if (!departureDate) {
        errors.addError(
            departureDate,
            'Departure date is required',
            'departureDate'
        );
    } else {
        if (!validDate(departureDate)) {
            errors.addError(
                departureDate,
                'Departure date is in the wrong format',
                'departureDate'
            );
        }
    }

    if (!arrivalDate) {
        errors.addError(arrivalDate, 'Arrival date is required', 'arrivalDate');
    } else {
        if (!validDate(arrivalDate)) {
            errors.addError(
                arrivalDate,
                'Arrival date is in the wrong format',
                'arrivalDate'
            );
        }
    }

    if (!validator.isAfter(arrivalDate, departureDate)) {
        errors.addError(
            arrivalDate,
            'Arrival date must be after the departure date',
            'arrivalDate'
        );
    }

    if (!busId) {
        errors.addError(busId, 'Bus id is required', 'busId');
    } else {
        try {
            const validBus = await existsBus(busId);
            if (!validBus) {
                errors.addError(busId, 'There is no bus with that id', 'busId');
            }
        } catch (error) {
            return next(error);
        }
    }

    if (errors.errors.length > 0) {
        res.status(422);
        return next(errors);
    }

    return next();
};
