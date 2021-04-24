import express from "express";
import WebSocket from "ws";
import {ChampSelectStateApi, ChampSelectApi} from "lol-esports-spectate";
import * as path from "path";
import { State } from "lol-esports-spectate/dist/Interfaces";
const app = express();

const PORT:number = 8000;
const REPLAY: boolean = true;

console.log("  .____          .____       _________                     __          __               ________                    .__   ");             
console.log("  |    |    ____ |    |     /   _____/_____   ____   _____/  |______ _/  |_  ___________\\_____  \\___  __ ___________|  | _____  ___.__.");
console.log("  |    |   /  _ \\|    |     \\_____  \\\\____ \\_/ __ \\_/ ___\\   __\\__  \\\\   __\\/  _ \\_  __ \\/   |   \\  \\/ // __ \\_  __ \\  | \\__  \\<   |  |");
console.log("  |    |__(  <_> )    |___  /        \\  |_> >  ___/\\  \\___|  |  / __ \\|  | (  <_> )  | \\/    |    \\   /\\  ___/|  | \\/  |__/ __ \\\\___  |");
console.log("  |_______ \\____/|_______ \\/_______  /   __/ \\___  >\\___  >__| (____  /__|  \\____/|__|  \\_______  /\\_/  \\___  >__|  |____(____  / ____|");
console.log("          \\/             \\/        \\/|__|        \\/     \\/          \\/                          \\/          \\/                \\/\\/     ");


// console.log("\r\n\u2588\u2591\u2591\u2003\u2588\u2580\u2588\u2003\u2588\u2591\u2591\u2003\u2588\u2580\u2003\u2588\u2580\u2588\u2003\u2588\u2580\u2580\u2003\u2588\u2580\u2580\u2003\u2580\u2588\u2580\u2003\u2584\u2580\u2588\u2003\u2580\u2588\u2580\u2003\u2588\u2580\u2588\u2003\u2588\u2580\u2588\u2003\u2588\u2580\u2588\u2003\u2588\u2591\u2588\u2003\u2588\u2580\u2580\u2003\u2588\u2580\u2588\u2003\u2588\u2591\u2591\u2003\u2584\u2580\u2588\u2003\u2588\u2584\u2588\r\n\u2588\u2584\u2584\u2003\u2588\u2584\u2588\u2003\u2588\u2584\u2584\u2003\u2584\u2588\u2003\u2588\u2580\u2580\u2003\u2588\u2588\u2584\u2003\u2588\u2584\u2584\u2003\u2591\u2588\u2591\u2003\u2588\u2580\u2588\u2003\u2591\u2588\u2591\u2003\u2588\u2584\u2588\u2003\u2588\u2580\u2584\u2003\u2588\u2584\u2588\u2003\u2580\u2584\u2580\u2003\u2588\u2588\u2584\u2003\u2588\u2580\u2584\u2003\u2588\u2584\u2584\u2003\u2588\u2580\u2588\u2003\u2591\u2588\u2591")
// app.get("/", (req,res) => {
//     res.send("Hello OBS World!");
// });

app.listen(PORT, () =>{
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
})

// app.use(express.static('public'))

app.use(express.static(path.join(__dirname,"..","overlay-app", 'build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname,"..","overlay-app",  'build','index.html'));
});

app.get('/alt', function (req, res) {
	res.sendFile(path.join(__dirname,"..","overlay-app",  'build','index.html'));
});

let webSock = new WebSocket.Server({port:8080})

var api = new ChampSelectStateApi(REPLAY,"./overlay-app/src/assets/replay_full.json");

var currentState = null;
var currentPickOrder = null;
var currentChampionSelectEnded = false;
var currentChampionSelectStarted = false


	api.on("newState", function (data) {
		currentState = data;
		console.log("Event newState")
	});

	api.on("championSelectStarted", function () {
		currentChampionSelectStarted = true;
		currentChampionSelectEnded = false;
		console.log("championSelectStarted")
	});

	api.on("championSelectEnd", function(){
		currentChampionSelectStarted = true;
		currentChampionSelectEnded = true;
		console.log("championSelectEnded")
	})

	api.on("newPickOrder", function (data){
		currentPickOrder = data;
		console.log("newPickOrder");
	})

webSock.on("connection", function connection(ws){
	console.log("new connection opened")
    // ws.on("message", function incoming(message){	
    //     console.log("received: %s", message);
    //     ws.send("hello client");
    // });
	// if(REPLAY){
	// 	api = new ChampSelectStateApi(REPLAY,"./overlay-app/src/assets/replay_full.json");
	// }

	if(currentChampionSelectStarted)
		ws.send(JSON.stringify({"event":"championSelectStarted"}))
	if(currentState!=null)
		ws.send(JSON.stringify({"event":"newState", "data":currentState}));
	if(currentPickOrder!=null)
		ws.send(JSON.stringify({"event":"newPickOrder", "data":currentPickOrder}))
	if(currentChampionSelectEnded)
		ws.send(JSON.stringify({"event":"championSelectEnded"}))



	const newState = (state:State) => {
		ws.send(JSON.stringify({"event":"newState", "data":state}))
		// console.log("Event newState")
	};

	const championSelectStarted = () =>{
		ws.send(JSON.stringify({"event":"championSelectStarted"}))
		// console.log("championSelectStarted")
	};

	const championSelectEnded = ()=>{
		ws.send(JSON.stringify({"event":"championSelectEnded"}))
		// console.log("championSelectEnded")
	};

	const newPickOrder = (state:State)=>{
		ws.send(JSON.stringify({"event":"newPickOrder", "data":state}))
		// console.log("newPickOrder")
	}
	


	//ws.on("open", () =>{
		api.addListener("newState", newState);
		api.addListener("championSelectStarted", championSelectStarted);
		api.addListener("championSelectEnd", championSelectEnded);
		api.addListener("newPickOrder", newPickOrder);
	//})

	// ws.on("close",()=>{
	// 	api.removeListener("newState", newState);
	// 	api.removeListener("championSelectStarted", championSelectStarted);
	// 	api.removeListener("championSelectEnd", championSelectEnded);
	// 	api.removeListener("newPickOrder", newPickOrder);
	// })

	// api.on("newState", function (data) {
	// 	ws.send(JSON.stringify({"event":"newState", "data":data}))
	// 	console.log("Event newState")
	// });

	// // api.lis
	// api.on("championSelectStarted", function () {
	// 	ws.send(JSON.stringify({"event":"championSelectStarted"}))
	// 	console.log("championSelectStarted")
	// });

	// api.on("championSelectEnd", function(){
	// 	ws.send(JSON.stringify({"event":"championSelectEnded"}))
	// 	console.log("championSelectEnded")
	// })

	// api.on("newPickOrder", function (data){
	// 	ws.send(JSON.stringify({"event":"newPickOrder", "data":data}))
	// 	console.log("newPickOrder")
	// 	// console.log(data)
	// })

	

	//send req to lol-lobby/v2/lobby/members


    // ws.send("something")
})







