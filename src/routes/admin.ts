import express, { Request } from 'express';
import * as adminController from '../controllers/admin';
import { body } from 'express-validator';
import passport, { authenticate } from 'passport';
import { validLocation } from '../helpers/validation';
import { validateTripInputs } from '../validation/admin';

const router = express.Router();

router.post('/trips', validateTripInputs, adminController.createTrip);

router.put('/trips/:tripId' /*, adminController.editTrip */);

router.delete('/trips/:tripId' /*, adminController.deleteTrip */);

router.post('/bus' /*, adminController.addBus */);

router.put('/bus/:busId' /*, adminController.editBus */);

router.delete('/bus/:busId' /*, adminController.deleteBus */);

export default router;
