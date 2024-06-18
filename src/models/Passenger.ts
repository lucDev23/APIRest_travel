import mongoose, { Schema } from 'mongoose';
import { IPassenger } from '../interfaces/IPassenger';

const passengerSchema: Schema<IPassenger> = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    document: { type: String, required: true },
});

export default mongoose.model<IPassenger>('Booking', passengerSchema);
