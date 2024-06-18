import mongoose, { Schema } from 'mongoose';
import { User } from '../interfaces/User';

const userSchema: Schema<User> = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

export default mongoose.model<User>('User', userSchema);
