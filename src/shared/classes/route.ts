import { ForkliftInstruction } from "./forkliftInstruction";

enum RouteStatus {
    queued     = 1,
    inProgress = 2,
    completed  = 3,
    failed     = 4
}

export class Route {
    static statusEnum = RouteStatus;
    id: string;
    instructions: ForkliftInstruction[];
    constructor(id: string, instructions: ForkliftInstruction[]) {
        this.id = id;
        this.instructions = instructions;
    }
}