import mongoose, { Schema } from 'mongoose';
import { ITrip } from '../interfaces/ITrip';
import { Request, Response, NextFunction } from 'express';

const tripSchema: Schema<ITrip> = new Schema({
    departureDate: { type: Date, required: true },
    arrivalDate: { type: Date, required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    middleDestinations: [{ type: Schema.Types.ObjectId, ref: 'Location' }],
    bus: { type: Schema.Types.ObjectId, ref: 'Bus', required: true },
});

export const Trip = mongoose.model<ITrip>('Trip', tripSchema);

export const validTrip = async (): Promise<Boolean> => {
    //
    return true;
};
