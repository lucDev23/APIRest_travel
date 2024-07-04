import { Types } from 'mongoose';

export interface ITrip {
    departureDate: Date;
    arrivalDate: Date;
    origin: string;
    destination: string;
    middleLocations: Types.ObjectId[];
    busId: Types.ObjectId;
}
