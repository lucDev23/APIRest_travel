import { Edge } from '../models/Edge';
import { Location } from '../models/Location';
import { PriorityQueue } from 'typescript-collections';

interface AdjacencyMatrixCell {
    connected: number;
    distance: number;
}

export class LocationGraph {
    graph: AdjacencyMatrixCell[][];
    locationsMap: Map<string, number>;

    constructor() {
        this.locationsMap = new Map();
        this.graph = [[]];
    }

    async init(): Promise<void> {
        try {
            const locations = (await Location.find()).map(
                (location) => location.name
            );

            this.graph = Array.from(Array(locations.length), () =>
                Array(locations.length).fill({
                    connected: 0,
                    distance: Infinity,
                })
            );

            for (const [index, value] of locations.entries()) {
                this.locationsMap.set(value, index);
            }

            for (const [location, index] of this.locationsMap.entries()) {
                const edges = await Edge.find({ startLocation: location });

                edges.forEach((edge) => {
                    const connectedLocation = edge.endLocation;
                    const connectedIndex =
                        this.locationsMap.get(connectedLocation);

                    if (connectedIndex !== undefined) {
                        this.graph[index][connectedIndex] = {
                            connected: 1,
                            distance: edge.distance,
                        };
                    }
                });
            }
        } catch (error) {
            console.error('Error initializing graph:', error);
        }
    }

    print() {
        this.graph.forEach((row) => {
            console.log(row.map((cell) => cell.connected));
        });
    }
}
