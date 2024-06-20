import { Types } from 'mongoose';

export interface ITrip {
    departureDate: Date;
    arrivalDate: Date;
    origin: string;
    destination: string;
    bus: Types.ObjectId;
}
