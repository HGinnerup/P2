import {DataContainer} from "./classes/dataContainer"
import {WebServer} from "./classes/webServer"

const hostname = '127.0.0.1';
const port = 3000;

class Main {
    server:WebServer;
    data:DataContainer;
    
    constructor(port:number, hostname:string) {
        this.data = new DataContainer();
        this.server = new WebServer(this.data, port, hostname);
        this.server.run();
        this.update();
    }

    update() {
        let self = this;
        setImmediate(function() {
            self.update();
        });
    }
}

let main = new Main(port, hostname);