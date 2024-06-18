import { Types } from 'mongoose';

export interface IBus {
    capacity: number;
    trips: Types.ObjectId[];
}
