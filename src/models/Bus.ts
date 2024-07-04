import mongoose, { Schema, Types } from 'mongoose';
import { IBus } from '../interfaces/IBus';
import { Trip } from './Trip';

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

// FIX
export const availableBus = async (
    busId: string,
    departureDate: Date,
    arrivalDate: Date
) => {};
