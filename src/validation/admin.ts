import Bus from '../models/Bus';
import Trip from '../models/Trip';
import { Request, Response, NextFunction } from 'express';
import { CustomValidationError } from '../types/CustomValidationError';
import validator from 'validator';
import { existsAllLocations, existsLocation } from '../models/Location';

export const validateTripInputs = async (
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

    const errors: CustomValidationError = new CustomValidationError();

    if (!departureDate) {
        errors.addError(
            departureDate,
            'Departure date is required',
            'departureDate'
        );
    }

    if (!validator.isISO8601(departureDate) && departureDate) {
        errors.addError(
            departureDate,
            'Departure date is in the wrong format',
            'departureDate'
        );
    }

    if (!arrivalDate) {
        errors.addError(arrivalDate, 'Arrival date is required', 'arrivalDate');
    }

    if (!validator.isISO8601(arrivalDate) && arrivalDate) {
        errors.addError(
            arrivalDate,
            'Arrival date is in the wrong format',
            'arrivalDate'
        );
    }

    if (!origin) {
        errors.addError(origin, 'Origin is required', 'origin');
    }

    const validOrigin = await existsLocation(origin);
    if (!validOrigin) {
        errors.addError(
            origin,
            'Origin location is not a valid option',
            'origin'
        );
    }

    if (!destination) {
        errors.addError(destination, 'Destination is required', 'destination');
    }

    const validDestination = await existsLocation(destination);
    if (!validDestination) {
        errors.addError(
            destination,
            'Destination location is not a valid option',
            'destination'
        );
    }

    const invalidLocations = await existsAllLocations(middleDestinations);
    if (invalidLocations.length !== 0) {
        invalidLocations.forEach((location) => {
            errors.addError(
                middleDestinations[middleDestinations.indexOf(location)],
                `Middle destination '${location}' is not a valid option`,
                'middleDestinations'
            );
        });
    }

    if (errors.errors.length > 0) {
        return next(errors);
    }

    return next();
};

export const validTrip = async (
    departureDate: string,
    arrivalDate: string,
    origin: string,
    destination: string,
    bus: string
) => {
    const trip = Trip.findOne({
        departureDate: departureDate,
        arrivalDate: arrivalDate,
        origin: origin,
        destination: destination,
        bus: bus,
    });
};
