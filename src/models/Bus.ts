import mongoose, { Schema } from 'mongoose';
import { IBus } from '../interfaces/IBus';
import { ITrip } from '../interfaces/ITrip';
import { Trip } from './Trip';

const busSchema: Schema<IBus> = new Schema({
    capacity: { type: Number, required: true, unique: true },
    actualLocation: {
        type: Schema.Types.ObjectId,
        ref: 'Location',
        required: true,
    },
    trips: [{ type: Schema.Types.ObjectId, ref: 'Trip' }],
});

export const Bus = mongoose.model<IBus>('Bus', busSchema);

export const insertBus = async (capacity: number): Promise<IBus> => {
    const bus = new Bus({ capacity });
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
// export const availableBus = async (busId)
