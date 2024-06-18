import mongoose, { Schema } from 'mongoose';
import { ITrip } from '../interfaces/ITrip';

const tripSchema: Schema<ITrip> = new Schema({
    departureDate: { type: Date, required: true },
    arrivalDate: { type: Date, required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
});

export default mongoose.model<ITrip>('Trip', tripSchema);
