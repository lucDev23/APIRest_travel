import { Edge } from '../models/Edge';
import { Location } from '../models/Location';

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

    getWays(start: string, end: string): string[][] {
        const startIdx = this.locationsMap.get(start);
        const endIdx = this.locationsMap.get(end);

        if (startIdx === undefined || endIdx === undefined) {
            throw new Error(
                'Start or end location does not exist in the graph'
            );
        }

        const visited = new Array(this.graph.length).fill(false);
        const paths: string[][] = [];
        const path: string[] = [];

        const dfs = (currentIdx: number, endIdx: number, path: string[]) => {
            path.push(this.getLocationByIndex(currentIdx));
            visited[currentIdx] = true;

            if (currentIdx === endIdx) {
                paths.push([...path]);
            } else {
                for (let i = 0; i < this.graph[currentIdx].length; i++) {
                    if (this.graph[currentIdx][i].connected && !visited[i]) {
                        dfs(i, endIdx, path);
                    }
                }
            }

            path.pop();
            visited[currentIdx] = false;
        };

        dfs(startIdx, endIdx, path);

        return paths;
    }

    private getLocationByIndex(index: number): string {
        for (let [location, idx] of this.locationsMap.entries()) {
            if (idx === index) {
                return location;
            }
        }
        throw new Error('Location index not found');
    }

    private arraysEqual(arr1: string[], arr2: string[]): boolean {
        if (arr1.length !== arr2.length) {
            return false;
        }
        return arr1.every((value, index) => value === arr2[index]);
    }

    validWay(start: string, end: string, locations: string[]): boolean {
        const ways = this.getWays(start, end);
        return ways.some((way) => this.arraysEqual(locations, way));
    }
}
