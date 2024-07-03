import { Types } from 'mongoose';

export interface ITrip {
    departureDate: Date;
    arrivalDate: Date;
    origin: string;
    destination: string;
    middleDestinations: Types.ObjectId[];
    busId: Types.ObjectId;
}
