import {Forklift} from "../forklift"
import {DataContainer} from "./dataContainer"
import {IncomingMessage, ServerResponse} from "http"

function hasId(element):boolean {
    return typeof(element) === "string";
}

export class Handler {
    forklift:Forklift;
    constructor(forklift:Forklift) {
        this.forklift = forklift;
    }

    routes(request:IncomingMessage, response:ServerResponse, parsedUrl:string[]) {
        if (request.method === "GET") {

            response.writeHead(200,"okay");
            response.write(JSON.stringify(this.forklift.routes));
            response.end();
            
            console.log(`METHOD = ${request.method} (GET)`);
        } else {
            console.log("error");
            response.writeHead(500,"error");
            response.end();
        }
    }

    info(request:IncomingMessage, response:ServerResponse, parsedUrl:string[]) {
        const id = hasId(parsedUrl[2]) ? parsedUrl[2] : null;
    
        if (request.method === "GET") {
            if (id !== null) {
                console.log(`METHOD = ${request.method} (GET), id = ${id} (nnull)`);
                response.writeHead(200,"okay");
                response.end();
            } else {
                console.log(`METHOD = ${request.method} (GET), id = ${id} (null)`);
                response.writeHead(500,"error");
                response.end();
            }
        } else if (request.method === "POST") {
            console.log(`METHOD = ${request.method} (POST)`);
            response.writeHead(200,"ok");
            response.end();
        } else {
            console.log("error");
            response.writeHead(500,"error");
            response.end();
        }
    }
}

