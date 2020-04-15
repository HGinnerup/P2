import { Vector2 } from "./vector2";

/** A graph cointaining interconnected vertices */
export class Graph {
    /** A dictionary of vertices contained in the graph */
    vertices: { [key: string]: Vertex; };

    constructor(vertices: { [key: string]: Vertex; }) {
        this.vertices = vertices || {};
    }

    /**
     * Returns direct distance between two vertices
     * @param vertex_1 First vertex
     * @param vertex_2 Second vertex
     * @return Distance between the vertices
     */
    getDistanceDirect(vertex_1: Vertex, vertex_2: Vertex): number {
        return vertex_1.getDistanceDirect(vertex_2);
    }

    /**
     * Loops through each adjecent vertex within each vertex on the graph
     * @return Array of objects with two vertex ids
     */
    getEdges(): { vertexId_1: string, vertexId_2: string; }[] {
        let output = [];
        for (let vertexId_1 in this.vertices) {
            for (let key in this.vertices[vertexId_1].adjacentVertexIds) {
                let vertexId_2 = this.vertices[vertexId_1].adjacentVertexIds[key];
                if (vertexId_1 < vertexId_2) {
                    output.push({ "vertexId_1": vertexId_1, "vertexId_2": vertexId_2 });
                }
            }
        }
        return output;
    }

    /**
     * Returns a new graph containing only the legal conent of the parameret graph
     * @param graph The graph to be parsed
     * @return The new graph
     */
    static parse(graph: any): Graph | null {
        // Check necessary fields
        if (typeof (graph) !== "object" || graph === null) return null;
        if (typeof (graph.vertices) !== "object" || graph.vertices === null) return null;

        // All vertices are vertex
        let keys: string[] = Object.keys(graph.vertices);
        let length: number = keys.length;
        for (let i = 0; i < length; i++) {
            let tempVertex: Vertex | null = Vertex.parse(graph.vertices[keys[i]]);
            if (tempVertex === null) {
                delete graph.vertices[keys[i]];
            }
        }

        // Check for both-way edges
        let tempVertices: { [key: string]: Vertex; } = {};
        keys = Object.keys(graph.vertices);
        length = keys.length;
        for (let i = 0; i < length; i++) {
            let currVertex: Vertex = graph.vertices[keys[i]];
            let tempVertex: Vertex = Vertex.parse(currVertex);

            if (tempVertex !== null) {
                tempVertex.adjacentVertexIds = [];
                for (let j = 0; j < currVertex.adjacentVertexIds.length; j++) {
                    if (graph.vertices[currVertex.adjacentVertexIds[j]].adjacentVertexIds.includes(currVertex.id)) {
                        tempVertex.adjacentVertexIds.push(currVertex.adjacentVertexIds[j]);
                    }
                }
                tempVertices[tempVertex.id] = tempVertex;
            }
        }

        return new Graph(tempVertices);
    }

    /**
     * Creates a new graph containing a clone of each object in the graph the function is called on
     * @return A new graph
     */
    clone(): Graph {
        let newVertices: { [key: string]: Vertex; } = {};

        for (let key in this.vertices) {
            newVertices[key] = this.vertices[key].clone();
        }

        return new Graph(newVertices);
    }

    /**
     * Sets the isVisited value of each vertex in the graph to false
     */
    reset(): void {
        let keys: string[] = Object.keys(this.vertices);
        let length: number = keys.length;
        for (let i = 0; i < length; i++) {
            this.vertices[keys[i]].isVisited = false;
        }
    }

}

/**
 * A vertex which in compination with the vertices adjecent to it make up a graph
 */
export class Vertex {
    /** A vertex identification string */
    id: string;

    /** A vector representing the position of the vertex */
    position: Vector2;

    /** A label used by the user interface */
    label: string;

    /** An array of identification strings for adjecent vertices */
    adjacentVertexIds: string[];

    /** An array of Scheduleitems specifying when forklifts move through the vertex */
    scheduleItems?: ScheduleItem[];

    /** A vertex reference to the previous vertex  */
    previousVertex: Vertex | null;

    isVisited: boolean;

    constructor(id: string, position: Vector2, label?: string) {
        this.id = id;
        this.position = position;
        this.label = label || null;
        this.adjacentVertexIds = [];
        this.scheduleItems = [];
        this.previousVertex = null;
        this.isVisited = false;
    }

    /**
     * Finds the direct distance between the parameter vertex at the vertex the function is called on
     * @param vertex The vertex which the distance is calculated to
     * @return The direct distance
     */
    getDistanceDirect(vertex: Vertex): number {
        return vertex && this.position.getDistanceTo(vertex.position);
    }


    static parse(vertex: any): Vertex | null {
        // Check for necessary field types
        if (typeof (vertex) !== "object" || vertex === null) return null;
        if (typeof (vertex.id) !== "string") return null;
        if (typeof (vertex.position) !== "object" || vertex.position === null) return null;

        // Check for a valid position
        let tempVector: Vector2 | null = Vector2.parse(vertex.position);
        if (tempVector === null) return null;

        // Check for label
        let tempLabel: string = null;
        if (typeof (vertex.label) === "string" && vertex.label.length > 0) {
            tempLabel = vertex.label;
        }

        // Check adjacency list
        let tempAdjacency: string[] = [];
        if (typeof (vertex.adjacentVertexIds) === "object" && vertex.adjacentVertexIds !== null) {
            for (let i = 0; i < vertex.adjacentVertexIds.length; i++) {
                if (typeof (vertex.adjacentVertexIds[i]) && vertex.adjacentVertexIds[i].length > 0) {
                    tempAdjacency.push(vertex.adjacentVertexIds[i]);
                }
            }
        }

        // Check schedule items
        let tempSchedule: ScheduleItem[] = [];
        if (typeof (vertex.scheduleItems) === "object" && vertex.scheduleItems !== null) {
            for (let i = 0; i < vertex.scheduleItems.length; i++) {
                let tempItem: ScheduleItem = ScheduleItem.parse(vertex.scheduleItems[i]);
                if (tempItem !== null) {
                    tempSchedule.push(tempItem);
                }
            }
        }

        // Create the now valid vertex and add adjacency and schedule items
        let tempVertex: Vertex = new Vertex(vertex.id, tempVector, tempLabel);
        tempVertex.adjacentVertexIds = tempAdjacency;
        tempVertex.scheduleItems = tempSchedule;

        return tempVertex;
    }

    clone(): Vertex {
        let v = new Vertex(this.id, this.position.clone(), this.label);

        for (let a in this.adjacentVertexIds) {
            v.adjacentVertexIds.push(a);
        }

        v.scheduleItems = [];
        for (let s in this.scheduleItems) {
            v.scheduleItems.push(this.scheduleItems[s].clone());
        }

        return v;
    }

    static parseMultiple(vertices: Vertex[]): Vertex[] | null {
        vertices.forEach(element => {
            if (typeof (Vertex.parse(element)) === "object") return null;
        });
        let newVertices: Vertex[] = [];
        vertices.forEach(element => {
            newVertices.push(element);
        });

        return newVertices;
    }

    // A* related 
    g(startId: string): number {
        if (this.id === startId || this.previousVertex === null) {
            return 0;
        } else {
            return this.previousVertex.g(startId) + (this.position.getDistanceTo(this.previousVertex.position));
        }
    }






}

export class ScheduleItem {
    forkliftId: string;
    time: number;
    nextVertexId: string;

    constructor(forkliftId: string, time: number, nextVertexId: string) {
        this.forkliftId = forkliftId;
        this.time = time;
        this.nextVertexId = nextVertexId;
    }

    static parse(item: any): ScheduleItem | null {
        // Check all necessary fields
        if (typeof (item) !== "object" || item === null) return null;
        if (typeof (item.forkliftId) !== "string" || item.nextVertexId.length < 1) return null;
        if (typeof (item.time) !== "number") return null;
        if (typeof (item.nextVertexId) !== "string" || item.nextVertexId.length < 1) return null;

        return new ScheduleItem(item.forkliftId, item.time, item.nextVertexId);
    }

    clone(): ScheduleItem {
        return new ScheduleItem(this.forkliftId, this.time, this.nextVertexId);
    }

}
