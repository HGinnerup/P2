import { Graph, Vertex } from "../planningScheduler/classes/graph";
import { Vector2 } from "../planningScheduler/classes/vector2";
import * as fs from "fs";

let g = createGraph();
console.log(g);
let prettyG = JSON.stringify(g, null, 4);
console.log(prettyG);
fs.writeFileSync("./graf.json", prettyG);

function createGraph() {
    let vertices = createVertices(10, 10);
    let graph = new Graph(vertices);
    let edges = graph.getEdges();
    console.log("EDGES!!! \n\n", edges);

    return graph;
}

function createVertices(xSize: number, ySize: number): { [key: string]: Vertex; } {
    let vertices = {};

    for (let x = 0; x < xSize; x++) {
        for (let y = 0; y < ySize; y++) {
            let id = `n${x}-${y}`;
            vertices[id] = new Vertex(id, new Vector2(x, y), id);
            if (y > 0) {
                let neighborId = `n${x}-${y - 1}`;
                vertices[id].adjacentVertexIds.push(neighborId);
                vertices[neighborId].adjacentVertexIds.push(id);
            }
            if (x > 0 && (y === 0 || y === ySize - 1)) {
                let neighborId = `n${x - 1}-${y}`;
                vertices[id].adjacentVertexIds.push(neighborId);
                vertices[neighborId].adjacentVertexIds.push(id);
            }
        }
    }
    return vertices;
}