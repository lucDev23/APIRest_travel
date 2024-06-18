import mongoose, { Schema } from 'mongoose';
import { IBus } from '../interfaces/IBus';

const busSchema: Schema<IBus> = new Schema({
    capacity: { type: Number, required: true, unique: true },
    trips: [{ type: Schema.Types.ObjectId, ref: 'Trip' }],
});

export default mongoose.model<IBus>('Bus', busSchema);
