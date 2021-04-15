import express from "express";
import WebSocket from "ws";
import {ChampSelectStateApi, ChampSelectApi} from "lol-esports-spectate";
import * as path from "path";
const app = express();

const PORT:number = 8000;
const REPLAY: boolean = true;


console.log("  .____          .____       _________                     __          __               ________                    .__   ");             
console.log("  |    |    ____ |    |     /   _____/_____   ____   _____/  |______ _/  |_  ___________\\_____  \\___  __ ___________|  | _____  ___.__.");
console.log("  |    |   /  _ \\|    |     \\_____  \\\\____ \\_/ __ \\_/ ___\\   __\\__  \\\\   __\\/  _ \\_  __ \\/   |   \\  \\/ // __ \\_  __ \\  | \\__  \\<   |  |");
console.log("  |    |__(  <_> )    |___  /        \\  |_> >  ___/\\  \\___|  |  / __ \\|  | (  <_> )  | \\/    |    \\   /\\  ___/|  | \\/  |__/ __ \\\\___  |");
console.log("  |_______ \\____/|_______ \\/_______  /   __/ \\___  >\\___  >__| (____  /__|  \\____/|__|  \\_______  /\\_/  \\___  >__|  |____(____  / ____|");
console.log("          \\/             \\/        \\/|__|        \\/     \\/          \\/                          \\/          \\/                \\/\\/     ");

// app.get("/", (req,res) => {
//     res.send("Hello OBS World!");
// });
app.listen(PORT, () =>{
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
})

// app.use(express.static('public'))

app.use(express.static(path.join(__dirname,"..","overlay-app", 'build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname,"..","overlay-app",  'build','index.html'));
});

let webSock = new WebSocket.Server({port:8080})


webSock.on("connection", function connection(ws){
	console.log("new connection opened")
    // ws.on("message", function incoming(message){	
    //     console.log("received: %s", message);
    //     ws.send("hello client");
    // });

	var api = new ChampSelectStateApi(REPLAY,"./overlay-app/src/assets/replay_full.json");


	api.on("newState", function (data) {
		ws.send(JSON.stringify({"event":"newState", "data":data}))
		console.log("Event newState")
	});

	// api.lis
	api.on("championSelectStarted", function () {
		ws.send(JSON.stringify({"event":"championSelectStarted"}))
		console.log("championSelectStarted")
	});

	api.on("championSelectEnd", function(){
		ws.send(JSON.stringify({"event":"championSelectEnded"}))
		console.log("championSelectEnded")
	})

	api.on("newPickOrder", function (data){
		ws.send(JSON.stringify({"event":"newPickOrder", "data":data}))
		console.log("newPickOrder")
		// console.log(data)
	})

	

	//send req to lol-lobby/v2/lobby/members


    // ws.send("something")
})




