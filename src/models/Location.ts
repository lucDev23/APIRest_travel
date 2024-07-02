import mongoose, { Schema } from 'mongoose';
import { ILocation } from '../interfaces/ILocation';
import { Edge } from './Edge';

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

export const insertLocation = async (name: string): Promise<ILocation> => {
    const location = new Location({ name });
    await location.save();
    return location;
};

export const isLocationInBetween = async (
    startLocation: string,
    endLocation: string,
    middleLocation: string
): Promise<boolean> => {
    // Realizar una búsqueda en anchura desde startLocation hasta endLocation
    const queue: string[] = [startLocation];
    const visited: Set<string> = new Set();

    while (queue.length > 0) {
        const current = queue.shift()!;
        if (current === endLocation) {
            // Si llegamos a endLocation sin pasar por middleLocation, devolver false
            return false;
        }
        if (current === middleLocation) {
            // Si llegamos a middleLocation, buscar un camino desde middleLocation hasta endLocation
            const secondQueue: string[] = [middleLocation];
            const secondVisited: Set<string> = new Set();

            while (secondQueue.length > 0) {
                const secondCurrent = secondQueue.shift()!;
                if (secondCurrent === endLocation) {
                    return true;
                }
                secondVisited.add(secondCurrent);

                const nextEdges = await Edge.find({
                    startLocation: secondCurrent,
                });
                for (const edge of nextEdges) {
                    if (!secondVisited.has(edge.endLocation.toString())) {
                        secondQueue.push(edge.endLocation.toString());
                    }
                }
            }
            return false;
        }
        visited.add(current);

        const edges = await Edge.find({ startLocation: current });
        for (const edge of edges) {
            if (!visited.has(edge.endLocation.toString())) {
                queue.push(edge.endLocation.toString());
            }
        }
    }

    return false;
};

export const validateMiddleLocations = async (
    startLocation: string,
    endLocation: string,
    middleDestinations: string[]
): Promise<boolean> => {
    try {
        const validationResults = await Promise.all(
            middleDestinations.map((destination) =>
                isLocationInBetween(startLocation, endLocation, destination)
            )
        );

        return validationResults.every((result) => result === true);
    } catch (error) {
        console.error('Error validating middle locations:', error);
        return false;
    }
};
