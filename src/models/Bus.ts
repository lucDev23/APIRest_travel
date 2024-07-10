import mongoose, { Schema, Types } from 'mongoose';
import { IBus } from '../interfaces/IBus';
import { Trip } from './Trip';
import { Location } from './Location';

const busSchema: Schema<IBus> = new Schema({
    capacity: { type: Number, required: true },
    actualLocation: {
        type: Schema.Types.ObjectId,
        ref: 'Location',
        required: true,
    },
    trips: [{ type: Schema.Types.ObjectId, ref: 'Trip' }],
});

export const Bus = mongoose.model<IBus>('Bus', busSchema);

export const insertBus = async (
    capacity: number,
    actualLocation: Types.ObjectId
): Promise<IBus> => {
    const bus = new Bus({ capacity, actualLocation });
    await bus.save();
    return bus;
};

export const existsBus = async (busId: string): Promise<boolean> => {
    const exists = (await Bus.exists({ _id: busId })) === null ? false : true;
    return exists;
};

export const getOldestTrip = async (busId: string) => {
    const trips = await Trip.find({ busId: busId });
    console.log(trips);
};

export const availableBus = async (
    busId: string,
    departureDate: Date,
    arrivalDate: Date
): Promise<boolean> => {
    const trips = await Trip.find({ busId: busId });
    if (trips.length === 0) {
        return true;
    }

    const isOverlapping = trips.some((trip) => {
        return (
            (departureDate >= trip.departureDate &&
                departureDate <= trip.arrivalDate) ||
            (arrivalDate >= trip.departureDate &&
                arrivalDate <= trip.arrivalDate) ||
            (departureDate <= trip.departureDate &&
                arrivalDate >= trip.arrivalDate)
        );
    });

    return !isOverlapping;
};

export const busInLocation = async (
    locationName: string,
    busId: string
): Promise<boolean> => {
    const locationId = await Location.findOne({ name: locationName });
    const bus = await Bus.findById(busId);
    if (bus?.actualLocation.toString() !== locationId?._id.toString()) {
        return false;
    }
    return true;
};
