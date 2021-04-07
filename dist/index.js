"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var ws_1 = __importDefault(require("ws"));
var app = express_1["default"]();
var PORT = 8000;
console.log("  .____          .____       _________                     __          __               ________                    .__   ");
console.log("  |    |    ____ |    |     /   _____/_____   ____   _____/  |______ _/  |_  ___________\\_____  \\___  __ ___________|  | _____  ___.__.");
console.log("  |    |   /  _ \\|    |     \\_____  \\\\____ \\_/ __ \\_/ ___\\   __\\__  \\\\   __\\/  _ \\_  __ \\/   |   \\  \\/ // __ \\_  __ \\  | \\__  \\<   |  |");
console.log("  |    |__(  <_> )    |___  /        \\  |_> >  ___/\\  \\___|  |  / __ \\|  | (  <_> )  | \\/    |    \\   /\\  ___/|  | \\/  |__/ __ \\\\___  |");
console.log("  |_______ \\____/|_______ \\/_______  /   __/ \\___  >\\___  >__| (____  /__|  \\____/|__|  \\_______  /\\_/  \\___  >__|  |____(____  / ____|");
console.log("          \\/             \\/        \\/|__|        \\/     \\/          \\/                          \\/          \\/                \\/\\/     ");
app.get("/", function (req, res) {
    res.send("Hello OBS World!");
});
app.listen(PORT, function () {
    console.log("\u26A1\uFE0F[server]: Server is running at https://localhost:" + PORT);
});
app.use(express_1["default"].static('public'));
var webSock = new ws_1["default"].Server({ port: 8080 });
webSock.on("connection", function connection(ws) {
    ws.on("message", function incoming(message) {
        console.log("received: %s", message);
        ws.send("hello client");
    });
    ws.send("something");
});
//# sourceMappingURL=index.js.map