enum ForkliftInstructionTypes {
    move,
    unloadPallet,
    loadPallet,
    charge,
    wait,
    sendFeedback
}

export class ForkliftInstruction {
    static types = ForkliftInstructionTypes;
    
    type:ForkliftInstructionTypes;
    vertexId:string;
    palletId:string|null;

    constructor() {
        ForkliftInstruction.types.loadPallet
    }
}