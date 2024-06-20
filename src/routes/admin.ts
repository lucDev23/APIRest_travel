import express, { Request } from 'express';
import * as adminController from '../controllers/admin';
import { body } from 'express-validator';
import Trip from '../models/Trip';
import Bus from '../models/Bus';
import { existsLocation } from '../models/Location';
import passport, { authenticate } from 'passport';

const router = express.Router();

router.post(
    '/trips',
    [
        body(
            ['departureDate', 'arrivalDate', 'origin', 'destination'],
            'All fields are required'
        ).notEmpty(),

        body('departureDate', 'departureDate must be in date format').isDate(),
        body('arrivalDate', 'arrivalDate must be in date format').isDate(),
        body('origin').custom((origin: string): void => {
            if (!existsLocation(origin)) {
                throw new Error('Origin name is not a valid option');
            }
        }),
        body('destination').custom((destination: string): void => {
            if (!existsLocation(destination)) {
                throw new Error('Destination name is not a valid option');
            }
        }),
    ],
    adminController.createTrip
);

router.put('/trips/:tripId' /*, adminController.editTrip */);

router.delete('/trips/:tripId' /*, adminController.deleteTrip */);

router.post('/bus' /*, adminController.addBus */);

router.put('/bus/:busId' /*, adminController.editBus */);

router.delete('/bus/:busId' /*, adminController.deleteBus */);

export default router;
