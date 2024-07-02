import { Bus, existsBus } from '../models/Bus';
import { Trip } from '../models/Trip';
import { Request, Response, NextFunction } from 'express';
import { CustomValidationError } from '../types/CustomValidationError';
import validator from 'validator';
import {
    existsAllLocations,
    existsLocation,
    validateMiddleLocations,
} from '../models/Location';
import { validDate } from '../helpers/validDate';
import { Location } from '../models/Location';
import { Edge } from '../models/Edge';

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

            if (
                !(await validateMiddleLocations(
                    origin,
                    destination,
                    middleDestinations
                ))
            ) {
                errors.addError(
                    middleDestinations,
                    'Some Middle location is not connected',
                    'middleLocations'
                );
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

    req.body.origin = origin;
    req.body.destination = destination;
    req.body.middleDestinations = middleDestinations;
    req.body.departureDate = departureDate;
    req.body.arrivalDate = arrivalDate;
    req.body.busId = busId;

    return next();
};

export const validateLocationsInputs = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const locationName: string = validator.trim(req.body.locationName || '');

    const errors: CustomValidationError = new CustomValidationError();

    if (!locationName) {
        errors.addError(
            locationName,
            'Location name is required',
            'locationName'
        );
    }

    try {
        if (await Location.exists({ name: locationName })) {
            errors.addError(
                locationName,
                'Location name arredy exists',
                'locationName'
            );
        }
    } catch (error) {
        return next(error);
    }

    if (errors.errors.length > 0) {
        res.status(422);
        return next(errors);
    }

    req.body.locationName = locationName;

    return next();
};

export const validateConnectionInputs = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const locationOne: string = validator.trim(req.body.locationOne || '');
    const locationTwo: string = validator.trim(req.body.locationTwo || '');

    const errors: CustomValidationError = new CustomValidationError();

    if (!locationOne) {
        errors.addError(locationOne, 'Location one is required', 'locationOne');
    }

    try {
        if (locationOne && !(await Location.exists({ name: locationOne }))) {
            errors.addError(
                locationOne,
                'Location one name does not exists',
                'locationOne'
            );
        }
    } catch (error) {
        return next(error);
    }

    if (!locationTwo) {
        errors.addError(locationTwo, 'Location two is required', 'locationTwo');
    }

    try {
        if (locationTwo && !(await Location.exists({ name: locationTwo }))) {
            errors.addError(
                locationTwo,
                'Location two name does not exists',
                'locationTwo'
            );
        }
    } catch (error) {
        return next(error);
    }

    try {
        if (
            await Edge.exists({
                startLocation: locationOne,
                endLocation: locationTwo,
            })
        ) {
            errors.addError(
                [locationOne, locationTwo],
                'Connection between locations already exists',
                'locationOne, locationTwo'
            );
        }
    } catch (error) {
        return next(error);
    }

    if (errors.errors.length > 0) {
        res.status(422);
        return next(errors);
    }

    req.body.locationOne = locationOne;
    req.body.locationTwo = locationTwo;

    return next();
};

export const validateBusInputs = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const busCapacity: string = validator.trim(req.body.busCapacity || '');

    const errors: CustomValidationError = new CustomValidationError();

    if (!busCapacity) {
        errors.addError(busCapacity, 'Bus capacity is required', 'busCapacity');
    }

    try {
        if (busCapacity && !validator.isNumeric(busCapacity)) {
            errors.addError(
                busCapacity,
                'Bus capacity must be a numeric value',
                'busCapacity'
            );
        }
    } catch (error) {
        return next(error);
    }

    if (errors.errors.length > 0) {
        res.status(422);
        return next(errors);
    }

    req.body.busCapacity = Number(busCapacity);

    return next();
};
