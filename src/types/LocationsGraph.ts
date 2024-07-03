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

    // Function to find the shortest path that visits all intermediate destinations
    async findShortestPathWithIntermediates(
        start: string,
        end: string,
        middleDestinations: string[]
    ): Promise<number[]> {
        const fullPath = [start, ...middleDestinations, end];
        let totalPath: number[] = [];

        for (let i = 0; i < fullPath.length - 1; i++) {
            const partialPath = await this.dijkstra(
                fullPath[i],
                fullPath[i + 1]
            );
            if (partialPath.length === 0) return []; // No path found

            // Remove the last element to avoid repetition except for the final path segment
            if (i < fullPath.length - 2) partialPath.pop();
            totalPath = [...totalPath, ...partialPath];
        }
        return totalPath;
    }

    // Dijkstra's algorithm to find the shortest path between two nodes
    async dijkstra(start: string, end: string): Promise<number[]> {
        const startIdx = this.locationsMap.get(start);
        const endIdx = this.locationsMap.get(end);

        if (startIdx === undefined || endIdx === undefined) return [];

        const distances = Array(this.graph.length).fill(Infinity);
        const previous: number[] = Array(this.graph.length).fill(-1);
        const visited: boolean[] = Array(this.graph.length).fill(false);

        distances[startIdx] = 0;

        const pq = new PriorityQueue<number>(
            (a, b) => distances[a] - distances[b]
        );
        pq.enqueue(startIdx);

        while (!pq.isEmpty()) {
            const current = pq.dequeue()!;
            if (visited[current]) continue;

            visited[current] = true;
            if (current === endIdx) break;

            for (let neighbor = 0; neighbor < this.graph.length; neighbor++) {
                if (this.graph[current][neighbor].connected === 0) continue;
                if (visited[neighbor]) continue;

                const newDist =
                    distances[current] + this.graph[current][neighbor].distance;
                if (newDist < distances[neighbor]) {
                    distances[neighbor] = newDist;
                    previous[neighbor] = current;
                    pq.enqueue(neighbor);
                }
            }
        }

        const path = [];
        for (let at = endIdx; at !== -1; at = previous[at]) {
            path.push(at);
        }
        path.reverse();

        // Check if the start node is included in the path
        if (path[0] !== startIdx) return [];
        return path;
    }
}
