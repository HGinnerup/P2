import { WebServer } from "./classes/webServer";
import { Route } from "../shared/classes/route";

const server_hostname = '127.0.0.1';
const server_port = 3000;

export class Forklift {
    id:string;
    server:WebServer;
    routes:Route[];

    constructor(id:string, port:number, hostname:string) {
        this.id = id;
        this.server = new WebServer(this, port, hostname);
        this.server.run();
    }
}

var forklifts = [];
for(let i=0; i<100; i++) {
    forklifts.push(new Forklift(""+i, server_port, server_hostname))
}
