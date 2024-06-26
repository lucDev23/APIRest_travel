import Bus from '../models/Bus';
import Trip from '../models/Trip';
import { Request, Response, NextFunction } from 'express';
import { CustomValidationError } from '../types/CustomValidationError';
import validator from 'validator';

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

    if (!validator.isISO8601(departureDate)) {
        errors.addError(
            departureDate,
            'Departure date is in the wrong format',
            'departureDate'
        );
    }

    next(errors);
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
