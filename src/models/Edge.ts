import mongoose, { Schema, mongo } from 'mongoose';
import { IEdge } from '../interfaces/IEdge';

const edgeSchema: Schema<IEdge> = new Schema({
    startLocation: { type: String, required: true },
    endLocation: { type: String, required: true },
});

export const Edge = mongoose.model<IEdge>('Edge', edgeSchema);

export const insertEdge = async (
    startLocation: string,
    endLocation: string
): Promise<IEdge> => {
    const edge = new Edge({
        startLocation: startLocation,
        endLocation: endLocation,
    });
    const edgeTwo = new Edge({
        startLocation: endLocation,
        endLocation: startLocation,
    });
    await edge.save();
    await edgeTwo.save();
    return edge;
};
