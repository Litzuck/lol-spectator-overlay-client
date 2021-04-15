"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var ws_1 = __importDefault(require("ws"));
var lol_esports_spectate_1 = require("lol-esports-spectate");
var path = __importStar(require("path"));
var app = express_1["default"]();
var PORT = 8000;
var REPLAY = true;
console.log("  .____          .____       _________                     __          __               ________                    .__   ");
console.log("  |    |    ____ |    |     /   _____/_____   ____   _____/  |______ _/  |_  ___________\\_____  \\___  __ ___________|  | _____  ___.__.");
console.log("  |    |   /  _ \\|    |     \\_____  \\\\____ \\_/ __ \\_/ ___\\   __\\__  \\\\   __\\/  _ \\_  __ \\/   |   \\  \\/ // __ \\_  __ \\  | \\__  \\<   |  |");
console.log("  |    |__(  <_> )    |___  /        \\  |_> >  ___/\\  \\___|  |  / __ \\|  | (  <_> )  | \\/    |    \\   /\\  ___/|  | \\/  |__/ __ \\\\___  |");
console.log("  |_______ \\____/|_______ \\/_______  /   __/ \\___  >\\___  >__| (____  /__|  \\____/|__|  \\_______  /\\_/  \\___  >__|  |____(____  / ____|");
console.log("          \\/             \\/        \\/|__|        \\/     \\/          \\/                          \\/          \\/                \\/\\/     ");
// app.get("/", (req,res) => {
//     res.send("Hello OBS World!");
// });
app.listen(PORT, function () {
    console.log("\u26A1\uFE0F[server]: Server is running at https://localhost:" + PORT);
});
// app.use(express.static('public'))
app.use(express_1["default"].static(path.join(__dirname, "..", "overlay-app", 'build')));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, "..", "overlay-app", 'build', 'index.html'));
});
var webSock = new ws_1["default"].Server({ port: 8080 });
webSock.on("connection", function connection(ws) {
    console.log("new connection opened");
    // ws.on("message", function incoming(message){	
    //     console.log("received: %s", message);
    //     ws.send("hello client");
    // });
    var api = new lol_esports_spectate_1.ChampSelectStateApi(REPLAY, "./overlay-app/src/assets/replay_full.json");
    api.on("newState", function (data) {
        ws.send(JSON.stringify({ "event": "newState", "data": data }));
        console.log("Event newState");
    });
    // api.lis
    api.on("championSelectStarted", function () {
        ws.send(JSON.stringify({ "event": "championSelectStarted" }));
        console.log("championSelectStarted");
    });
    api.on("championSelectEnd", function () {
        ws.send(JSON.stringify({ "event": "championSelectEnded" }));
        console.log("championSelectEnded");
    });
    api.on("newPickOrder", function (data) {
        ws.send(JSON.stringify({ "event": "newPickOrder", "data": data }));
        console.log("newPickOrder");
        // console.log(data)
    });
    //send req to lol-lobby/v2/lobby/members
    // ws.send("something")
});
//# sourceMappingURL=index.js.map