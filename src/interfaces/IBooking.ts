import { Types } from 'mongoose';

export interface IBooking {
    trip: Types.ObjectId;
    user: Types.ObjectId;
    totalSeats: number;
    availableSeats: number;
    occupiedSeats: number;
    passengers: Types.ObjectId[];
}
