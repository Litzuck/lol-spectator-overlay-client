import {app, BrowserWindow, dialog, ipcMain, shell} from 'electron';
import * as path from "path";
import WebSocket from "ws";
import { State } from "lol-esports-spectate/dist/Interfaces";
import EventEmitter from "events"
import mergePatch from "json8-merge-patch"
import * as fs from "fs"
import ReplacableStateApi from './ReplacableStateApi';
import express from "express"
import { checkForNewChampionImages } from './downloadImages';
import MyWebSocketServer from './WebSocketServer';
import serveAsar from "express-serve-asar";
const REPLAY= false


const WEBSERVER_PORT = 36501
const WEBSOCKET_SERVER_PORT = 36502
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

app.on('ready', () => {
    createConfigWindow();
    const firstTimeFilePath = path.resolve(app.getPath('userData'), '.first-time-huh');
    let isFirstTime;
    try {
      fs.closeSync(fs.openSync(firstTimeFilePath, 'wx'));
      isFirstTime = true;
    } catch(e) {
      if (e.code === 'EEXIST') {
        isFirstTime = false;
      } else {
        // something gone wrong
        throw e;
      }
    }
    if (isFirstTime) {
        checkForNewChampionImages();
    }
});

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
    // shell.openExternal("https://google.com")
    api.connectToClient();
    if(win==null)
        createWindow();
    else
        win.show();
  })
ipcMain.on("fetch-summoner-names", function(event,args) {
    win.webContents.send("fetch-summoner-names-client", null)
})

ipcMain.on("open-overlay", function (event, arg) {
    shell.openExternal("http://localhost:" + WEBSERVER_PORT)
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

const contentBase = path.join(__dirname,"..", "build")

const middleware = serveAsar(contentBase)
 
// const devServerOptions = {
//   stats: {
//     colors: true 
//   },
//   hot: true,
//   inline: true,
//   host,
//   contentBase,
//   before (app) {
//     app.use(middleware)
//   }
// }


server = express();

server.use(express.static(path.join(__dirname,"..", "build")));

server.use(middleware);


server.get('/images/*', function(req,res) {
    res.sendFile(path.join(app.getPath('userData'), "images", req.params[0]))
})

server.get('*', function(req,res) {
    res.sendFile(path.join(__dirname,"..", "build", "index.html"))
})

serverSocket = server.listen(WEBSERVER_PORT, ()=>{
    console.log("server started om port "+WEBSERVER_PORT)
})


var webSocketServer = new MyWebSocketServer( WEBSOCKET_SERVER_PORT , 'localhost');

webSocketServer.start();

var api = webSocketServer.getStateApi();


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

configEventEmitter.addListener("newConfig", (config) => {
    webSocketServer.sendToAllClients(JSON.stringify({ "event": "newConfig", "data": config }))
})


ipcMain.on("getConfig", () =>{
    winConf.webContents.send("newConfig", config)
})


ipcMain.handle('update-images', () =>{
    console.log("update images")
    checkForNewChampionImages();
});


setInterval(()=>{
    var serverStatus ={
        webSocketServer: webSocketServer.getRunningStatus(),
        webServer: serverSocket != null ? "Running" : "Stopped",
        leagueClient: api.getConnectionStatus()
    }

    winConf.webContents.send("serverStatus", serverStatus)
}, 5000)

