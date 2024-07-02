import mongoose, { Schema } from 'mongoose';
import { IBus } from '../interfaces/IBus';

const busSchema: Schema<IBus> = new Schema({
    capacity: { type: Number, required: true, unique: true },
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

// FIX
// export const availableBus = async (busId)
