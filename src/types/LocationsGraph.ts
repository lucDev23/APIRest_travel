import { Edge } from '../models/Edge';
import { Location } from '../models/Location';

export class LocationGraph {
    graph: number[][];
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
                Array(locations.length).fill(0)
            );

            for (const [index, value] of locations.entries()) {
                this.locationsMap.set(value, index);
            }

            for (const [location, index] of this.locationsMap.entries()) {
                const connectedLocations = (
                    await Edge.find({ startLocation: location })
                ).map((edge) => edge.endLocation);

                connectedLocations.forEach((connectedLocation) => {
                    const connectedIndex =
                        this.locationsMap.get(connectedLocation);

                    if (connectedIndex !== undefined) {
                        this.graph[index][connectedIndex] = 1;
                    }
                });
            }
        } catch (error) {
            console.error('Error initializing graph:', error);
        }
    }

    print() {
        this.graph.forEach((row) => {
            console.log(row);
        });
    }

    // FIX
    bfs(start: string, end: string, middleDestinations: string[]): boolean {}
}
