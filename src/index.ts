import express from "express";
import WebSocket from "ws"
const app = express();

const PORT:number = 8000;


console.log("  .____          .____       _________                     __          __               ________                    .__   ");             
console.log("  |    |    ____ |    |     /   _____/_____   ____   _____/  |______ _/  |_  ___________\\_____  \\___  __ ___________|  | _____  ___.__.");
console.log("  |    |   /  _ \\|    |     \\_____  \\\\____ \\_/ __ \\_/ ___\\   __\\__  \\\\   __\\/  _ \\_  __ \\/   |   \\  \\/ // __ \\_  __ \\  | \\__  \\<   |  |");
console.log("  |    |__(  <_> )    |___  /        \\  |_> >  ___/\\  \\___|  |  / __ \\|  | (  <_> )  | \\/    |    \\   /\\  ___/|  | \\/  |__/ __ \\\\___  |");
console.log("  |_______ \\____/|_______ \\/_______  /   __/ \\___  >\\___  >__| (____  /__|  \\____/|__|  \\_______  /\\_/  \\___  >__|  |____(____  / ____|");
console.log("          \\/             \\/        \\/|__|        \\/     \\/          \\/                          \\/          \\/                \\/\\/     ");

app.get("/", (req,res) => {
    res.send("Hello OBS World!");
});
app.listen(PORT, () =>{
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
})

app.use(express.static('public'))

let webSock = new WebSocket.Server({port:8080})

webSock.on("connection", function connection(ws){
    ws.on("message", function incoming(message){
        console.log("received: %s", message);
        ws.send("hello client");
    });

    ws.send("something")
})



