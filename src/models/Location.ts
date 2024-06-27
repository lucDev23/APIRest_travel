import mongoose, { Schema } from 'mongoose';
import { ILocation } from '../interfaces/ILocation';

const locationSchema: Schema<ILocation> = new Schema({
    name: { type: String, required: true, unique: true },
});

export const Location = mongoose.model<ILocation>('Location', locationSchema);

export const existsLocation = async (location: string): Promise<boolean> => {
    const exists =
        (await Location.exists({ name: location })) === null ? false : true;
    return exists;
};

export const existsAllLocations = async (
    locations: string[]
): Promise<string[]> => {
    const invalidLocations: string[] = [];

    for (const location of locations) {
        const exist = await Location.exists({ name: location });
        if (!exist) {
            invalidLocations.push(location);
        }
    }

    return invalidLocations;
};
