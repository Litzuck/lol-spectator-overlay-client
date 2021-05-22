import {app, BrowserWindow, dialog, ipcMain} from 'electron';
import * as path from "path";
import WebSocket from "ws";
import {ChampSelectStateApi} from "lol-esports-spectate";
import { State } from "lol-esports-spectate/dist/Interfaces";
import EventEmitter from "events"
import mergePatch from "json8-merge-patch"
import * as fs from "fs"
import ReplacableStateApi from './ReplacableStateApi';
import express from "express"

const REPLAY= false


var server;
var serverSocket;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow
let winConf: BrowserWindow

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        // width: 1616,
        // height: 959,
        width: 1600,
        height: 900,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        },
        frame: false,
    })
    // and load the index.html of the app.
    win.setContentSize(1600,900);
    win.loadFile(path.join(__dirname,'../build/index.html'));

    win.webContents.on('did-finish-load', () => {
        win.webContents.send('start-spectator', '');
    });

    // Open the DevTools.
    // win.webContents.openDevTools()

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
        winConf.webContents.send('overlay-stopped');
    });
};

function createReplayWindow(replayPath: string) {
    // Create the browser window.
    win = new BrowserWindow({
        // width: 1616,
        // height: 959,
        width: 1600,
        height: 900,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        },
        frame: false,
    });
    win.setContentSize(1600,900);
    // and load the index.html of the app.
    win.loadFile(path.join(__dirname, '../build/index.html'));

    win.webContents.on('did-finish-load', () => {
        win.webContents.send('load-replay', replayPath)
    });

    // Open the DevTools.
    // win.webContents.openDevTools()

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
        winConf.webContents.send('overlay-stopped');
    });
};

function createConfigWindow(){
    winConf = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        },
        frame: true,
    })

    // and load the index.html of the app.
    // winConf.loadFile('config.html')
    winConf.loadFile(path.join(__dirname,'../config.html'));
    // Open the DevTools.
    // win.webContents.openDevTools()

    // Emitted when the window is closed.
    winConf.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        winConf = null
    })
}

// windows.add(winConf)
// windows.add(win)


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createConfigWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on('create-overlay-window', function (event, arg) {
    api.connectToClient();
    if(win==null)
        createWindow();
    else
        win.show();
  })
ipcMain.on("fetch-summoner-names", function(event,args) {
    win.webContents.send("fetch-summoner-names-client", null)
})

ipcMain.on("load-replay", (event,path) => {
    if(win!=null)
        win.close()
    
    api.loadReplay(path)
    createReplayWindow(path);
})

ipcMain.on("stop-overlay", (event,path) => {
    if(win!=null)
        win.close()
})


ipcMain.handle('load-replay-dialog', async (event) => {
    console.log("test")
    const result = dialog.showOpenDialogSync({
        properties: ['openFile']
      })

    api.loadReplay(result[0])
    return result[0]
  })

ipcMain.handle("connect-to-client", async (event) =>{
    api.connectToClient();
    return true;
})


ipcMain.handle('start-web-server', async (event) => {
    server = express();

    server.use(express.static(path.join(__dirname,"..", "build")));
    server.get('*', function(req,res) {
        res.sendFile(path.join(__dirname,"..", "build", "index.html"))
    })

    serverSocket = server.listen(8000, ()=>{
        console.log("server started om port 8000")
    })

    return "success"
})

ipcMain.handle('stop-web-server', async (event) => {
    serverSocket.close();

    return "success"
})


var webSocketServer = new WebSocket.Server({ port: 8080 })

// var api = new ChampSelectStateApi(REPLAY, "./overlay-react/src/assets/replay_full.json");
var api = new ReplacableStateApi();
api.connectToClient();


var currentState = null;
var currentPickOrder = null;
var currentChampionSelectEnded = false;
var currentChampionSelectStarted = false;

api.on('newState', (state:State)=> currentState = state);
api.on('newPickOrder', (state:State)=> currentPickOrder = state);
api.on('championSelectStarted', () => {currentChampionSelectStarted =true; currentChampionSelectEnded=false; })
api.on('championSelectEnd', () => {currentChampionSelectEnded =true; currentChampionSelectStarted =false;})

var config = {};
fs.readFile(path.join(__dirname,"..","config.json"), { encoding: "utf8" }, (err, data) => {
	if (err) {
		console.error(err)
		return
	}
	var newConfig = JSON.parse(data)
	config = mergePatch.apply(config, newConfig)
    console.log("readConfig",config)
    winConf.webContents.send("newConfig",config)
})
var configEventEmitter = new EventEmitter();

ipcMain.on("newConfig", (event,newConfig)=>{
    config = mergePatch.apply(config,newConfig);
    console.log("on newConfig",config)
    fs.writeFile(path.join(__dirname,"..","config.json"), JSON.stringify(config), (err) =>{console.log(err)})

    configEventEmitter.emit("newConfig", config)
});

webSocketServer.on("connection", function connection(ws) {
	console.log("new connection opened")

	if (currentChampionSelectStarted)
		ws.send(JSON.stringify({ "event": "championSelectStarted" }))
	if (currentState != null)
		ws.send(JSON.stringify({ "event": "newState", "data": currentState }));
	if (currentPickOrder != null)
		ws.send(JSON.stringify({ "event": "newPickOrder", "data": currentPickOrder }))
	if (currentChampionSelectEnded)
		ws.send(JSON.stringify({ "event": "championSelectEnded" }))

	ws.send(JSON.stringify({ "event": "newConfig", "data": config }))

	const newState = (state: State) => {
		ws.send(JSON.stringify({ "event": "newState", "data": state }))
		// console.log("Event newState")
	};

	const championSelectStarted = () => {
		ws.send(JSON.stringify({ "event": "championSelectStarted" }))
		// console.log("championSelectStarted")
	};

	const championSelectEnded = () => {
		ws.send(JSON.stringify({ "event": "championSelectEnded" }))
		// console.log("championSelectEnded")
	};

	const newPickOrder = (state: State) => {
		ws.send(JSON.stringify({ "event": "newPickOrder", "data": state }))
		// console.log("newPickOrder")
	}

	configEventEmitter.addListener("newConfig", (config) => {
		ws.send(JSON.stringify({ "event": "newConfig", "data": config }))
	})

	api.addListener("newState", newState);
	api.addListener("championSelectStarted", championSelectStarted);
	api.addListener("championSelectEnd", championSelectEnded);
	api.addListener("newPickOrder", newPickOrder);
})

ipcMain.on("getConfig", () =>{
    winConf.webContents.send("newConfig", config)
})