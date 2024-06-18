import mongoose, { Schema } from 'mongoose';
import { IBooking } from '../interfaces/IBooking';

const bookingSchema: Schema<IBooking> = new Schema({
    trip: { type: Schema.Types.ObjectId, ref: 'Trip', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    totalSeats: { type: Number, required: true },
    availableSeats: { type: Number, required: true },
    occupiedSeats: { type: Number, required: true },
    passengers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Passenger',
            required: true,
        },
    ],
});

export default mongoose.model<IBooking>('Booking', bookingSchema);
