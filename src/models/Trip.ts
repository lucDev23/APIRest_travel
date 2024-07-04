import mongoose, { Schema } from 'mongoose';
import { ITrip } from '../interfaces/ITrip';
import { Request, Response, NextFunction } from 'express';

const tripSchema: Schema<ITrip> = new Schema({
    departureDate: { type: Date, required: true },
    arrivalDate: { type: Date, required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    middleLocations: [{ type: Schema.Types.ObjectId, ref: 'Location' }],
    busId: { type: Schema.Types.ObjectId, ref: 'Bus', required: true },
});

export const Trip = mongoose.model<ITrip>('Trip', tripSchema);

export const insertTrip = async (
    departureDate: string,
    arrivalDate: string,
    origin: string,
    destination: string,
    middleLocations: string[],
    busId: string
): Promise<ITrip> => {
    const trip = new Trip({
        departureDate: departureDate,
        arrivalDate: arrivalDate,
        origin: origin,
        destination: destination,
        middleLocations: middleLocations,
        busId: busId,
    });
    await trip.save();
    return trip;
};
