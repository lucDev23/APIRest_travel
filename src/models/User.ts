import mongoose, { Schema } from 'mongoose';
import { IUser } from '../interfaces/IUser';

const userSchema: Schema<IUser> = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

export default mongoose.model<IUser>('User', userSchema);
