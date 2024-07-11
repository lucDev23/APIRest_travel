import mongoose, { ObjectId, Schema } from 'mongoose';
import { ITrip } from '../interfaces/ITrip';
import { Request, Response, NextFunction } from 'express';
import { Bus } from './Bus';
import { Location } from './Location';

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
    const middleLocationsIds = [];
    for (const locationName of middleLocations) {
        const locationId = await Location.findOne({ name: locationName });
        middleLocationsIds.push(locationId);
    }

    const trip = new Trip({
        departureDate: departureDate,
        arrivalDate: arrivalDate,
        origin: origin,
        destination: destination,
        middleLocations: middleLocationsIds,
        busId: busId,
    });
    await trip.save();
    const bus = await Bus.findById(busId);
    await bus?.updateOne({ $push: { trips: trip._id } });
    await bus?.save();
    return trip;
};
