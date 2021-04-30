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
var electron_1 = require("electron");
var path = __importStar(require("path"));
var ws_1 = __importDefault(require("ws"));
var lol_esports_spectate_1 = require("lol-esports-spectate");
var events_1 = __importDefault(require("events"));
var json8_merge_patch_1 = __importDefault(require("json8-merge-patch"));
var fs = __importStar(require("fs"));
var REPLAY = false;
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var win;
var winConf;
function createWindow() {
    // Create the browser window.
    win = new electron_1.BrowserWindow({
        // width: 1616,
        // height: 959,
        width: 1600,
        height: 900,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        },
        frame: false
    });
    // and load the index.html of the app.
    win.setContentSize(1600, 900);
    win.loadFile(path.join(__dirname, '../build/index.html'));
    win.webContents.on('did-finish-load', function () {
        win.webContents.send('start-spectator', '');
    });
    // Open the DevTools.
    // win.webContents.openDevTools()
    // Emitted when the window is closed.
    win.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
        winConf.webContents.send('overlay-stopped');
    });
}
;
function createReplayWindow(replayPath) {
    // Create the browser window.
    win = new electron_1.BrowserWindow({
        // width: 1616,
        // height: 959,
        width: 1600,
        height: 900,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        },
        frame: false
    });
    win.setContentSize(1600, 900);
    // and load the index.html of the app.
    win.loadFile(path.join(__dirname, '../build/index.html'));
    win.webContents.on('did-finish-load', function () {
        win.webContents.send('load-replay', replayPath);
    });
    // Open the DevTools.
    // win.webContents.openDevTools()
    // Emitted when the window is closed.
    win.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
        winConf.webContents.send('overlay-stopped');
    });
}
;
function createConfigWindow() {
    winConf = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        },
        frame: true
    });
    // and load the index.html of the app.
    // winConf.loadFile('config.html')
    winConf.loadFile(path.join(__dirname, '../config.html'));
    // Open the DevTools.
    // win.webContents.openDevTools()
    // Emitted when the window is closed.
    winConf.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        winConf = null;
    });
}
// windows.add(winConf)
// windows.add(win)
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
electron_1.app.on('ready', createConfigWindow);
// Quit when all windows are closed.
electron_1.app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow();
    }
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
electron_1.ipcMain.on('create-overlay-window', function (event, arg) {
    if (win == null)
        createWindow();
    else
        win.show();
});
electron_1.ipcMain.on("fetch-summoner-names", function (event, args) {
    win.webContents.send("fetch-summoner-names-client", null);
});
electron_1.ipcMain.on("load-replay", function (event, path) {
    if (win != null)
        win.close();
    createReplayWindow(path);
});
electron_1.ipcMain.on("stop-overlay", function (event, path) {
    if (win != null)
        win.close();
});
var webSocketServer = new ws_1["default"].Server({ port: 8080 });
var api = new lol_esports_spectate_1.ChampSelectStateApi(REPLAY, "./overlay-react/src/assets/replay_full.json");
var currentState = null;
var currentPickOrder = null;
var currentChampionSelectEnded = false;
var currentChampionSelectStarted = false;
var config = {};
fs.readFile(path.join(__dirname, "..", "config.json"), { encoding: "utf8" }, function (err, data) {
    if (err) {
        console.error(err);
        return;
    }
    var newConfig = JSON.parse(data);
    config = json8_merge_patch_1["default"].apply(config, newConfig);
    console.log("readConfig", config);
    winConf.webContents.send("newConfig", config);
});
var configEventEmitter = new events_1["default"]();
electron_1.ipcMain.on("newConfig", function (event, newConfig) {
    config = json8_merge_patch_1["default"].apply(config, newConfig);
    console.log("on newConfig", config);
    fs.writeFile(path.join(__dirname, "..", "config.json"), JSON.stringify(config), function (err) { console.log(err); });
    configEventEmitter.emit("newConfig", config);
});
webSocketServer.on("connection", function connection(ws) {
    console.log("new connection opened");
    if (currentChampionSelectStarted)
        ws.send(JSON.stringify({ "event": "championSelectStarted" }));
    if (currentState != null)
        ws.send(JSON.stringify({ "event": "newState", "data": currentState }));
    if (currentPickOrder != null)
        ws.send(JSON.stringify({ "event": "newPickOrder", "data": currentPickOrder }));
    if (currentChampionSelectEnded)
        ws.send(JSON.stringify({ "event": "championSelectEnded" }));
    ws.send(JSON.stringify({ "event": "newConfig", "data": config }));
    var newState = function (state) {
        ws.send(JSON.stringify({ "event": "newState", "data": state }));
        // console.log("Event newState")
    };
    var championSelectStarted = function () {
        ws.send(JSON.stringify({ "event": "championSelectStarted" }));
        // console.log("championSelectStarted")
    };
    var championSelectEnded = function () {
        ws.send(JSON.stringify({ "event": "championSelectEnded" }));
        // console.log("championSelectEnded")
    };
    var newPickOrder = function (state) {
        ws.send(JSON.stringify({ "event": "newPickOrder", "data": state }));
        // console.log("newPickOrder")
    };
    configEventEmitter.addListener("newConfig", function (config) {
        ws.send(JSON.stringify({ "event": "newConfig", "data": config }));
    });
    api.addListener("newState", newState);
    api.addListener("championSelectStarted", championSelectStarted);
    api.addListener("championSelectEnd", championSelectEnded);
    api.addListener("newPickOrder", newPickOrder);
});
electron_1.ipcMain.on("getConfig", function () {
    winConf.webContents.send("newConfig", config);
});
//# sourceMappingURL=main.js.map