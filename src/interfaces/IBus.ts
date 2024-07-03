import { Types } from 'mongoose';

export interface IBus {
    capacity: number;
    actualLocation: Types.ObjectId;
    trips: Types.ObjectId[];
}
