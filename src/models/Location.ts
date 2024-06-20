import mongoose, { Schema } from 'mongoose';
import { ILocation } from '../interfaces/ILocation';

const locationSchema: Schema<ILocation> = new Schema({
    name: { type: String, required: true, unique: true },
});

export const Location = mongoose.model<ILocation>('Location', locationSchema);

export const existsLocation = (location: string): boolean => {
    return Location.exists({ name: location }) === null ? false : true;
};
