import http = require("http");
import fs = require("fs");
import { Handler } from "./handler";
import { Forklift } from "../forklift";

export class WebServer {
    server: http.Server;
    port: number;
    hostname: string;
    handler: Handler;

    constructor(forklift: Forklift, port: number, hostname: string) {
        this.port     = port;
        this.hostname = hostname;
        this.server   = http.createServer(this.serverSetup);
        this.handler  = new Handler(forklift);
    }

    serverSetup(request: http.IncomingMessage, response: http.ServerResponse) {
        request.method = request.method.toUpperCase();
        let parsedUrl = request.url.split("/");
        console.log(`${request.method}`);
        // control sequence
        switch (parsedUrl[1]) {
            case "routes":
                this.handler.routes(request, response, parsedUrl);
                break;
            case "info":
                this.handler.info(request, response, parsedUrl);
                break;
            default:
                response.writeHead(404);
                response.end();
            // Error handling
        }
    }

    run(): void {
        this.server.listen(this.port, this.hostname, () => {
            console.log(`Server running at http://${this.hostname}:${this.port}/`);
        });
    }

}
