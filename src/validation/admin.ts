import { ValidationChain, body } from 'express-validator';
import { validLocation } from '../helpers/validation';
import Bus from '../models/Bus';
import Trip from '../models/Trip';

export const validateTripInputs: ValidationChain[] = [
    body('departureDate')
        .notEmpty()
        .withMessage('Departure date is required')
        .isISO8601()
        .withMessage('Departure date must be in date format (ISO8601)'),

    body('arrivalDate')
        .notEmpty()
        .withMessage('Arrival date is required')
        .isISO8601()
        .withMessage('Arrival date must be in date format (ISO8601)'),

    body('origin')
        .notEmpty()
        .withMessage('Origin location is required')
        .custom((origin) => validLocation(origin)),

    body('destination')
        .notEmpty()
        .withMessage('Destination location is required')
        .custom((destination) => validLocation(destination)),

    body('middleDestinations').custom((middleDestinations) => {
        if (middleDestinations) {
            middleDestinations.forEach((e: string) => {
                validLocation(e);
            });
        }
        return true;
    }),

    body('bus')
        .notEmpty()
        .withMessage('Bus id is required')
        .custom(async (bus) => {
            const busExists = await Bus.findById(bus);
            if (!bus) {
                throw new Error(`No bus with id ${bus}`);
            }
        }),
];

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
