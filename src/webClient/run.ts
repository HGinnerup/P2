import { WebServerClient } from "./server";

setTimeout(() => {
    let server = new WebServerClient("localhost", 8080, "localhost", 3000);
    console.log(server);
}, 2000);