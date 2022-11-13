import {app, BrowserWindow, dialog, ipcMain, shell} from 'electron';
import * as path from "path";
import EventEmitter from "events"
import mergePatch from "json8-merge-patch"
import * as fs from "fs"
import express from "express"
import { checkForNewChampionImages } from './downloadImages';
import MyWebSocketServer from './WebSocketServer';
import serveAsar from "express-serve-asar";


const WEBSERVER_PORT = 36501
const WEBSOCKET_SERVER_PORT = 36502
var server;
var serverSocket;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let winConf: BrowserWindow

const defaultConfig = {
    webserverPort: WEBSERVER_PORT,
    websocketServerPort: WEBSOCKET_SERVER_PORT,
}

const defaultBrowserWindowOptions = {
    width: 1600,
    height: 900,
    webPreferences: {
        preload: path.join(__dirname, 'preload.js')
    },
    frame: true
}

var config = defaultConfig;

var webSocketServer: MyWebSocketServer = null;

function createConfigWindow(){
    winConf = new BrowserWindow(defaultBrowserWindowOptions);

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


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

app.whenReady().then(() => {
    loadConfig();
    startWebsocketServer();
    updateImagesOnFirstStart();
    setupIpcMainHandlers();
    handleStartWebServer();
    createConfigWindow();
    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (winConf === null) {
            createConfigWindow()
        }
    });
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
    if (winConf === null) {
        createConfigWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.




ipcMain.on("open-overlay", function (event, arg) {
    shell.openExternal("http://localhost:" + config.webserverPort);
});
var configEventEmitter = new EventEmitter();

ipcMain.on("newConfig", (event,newConfig)=>{
    config = mergePatch.apply(config,newConfig);
    console.log("on newConfig",config)
    fs.writeFile(path.join(__dirname,"..","config.json"), JSON.stringify(config), (err) =>{console.log(err)})

    configEventEmitter.emit("newConfig", config)
});

configEventEmitter.addListener("newConfig", (config) => {
    webSocketServer.sendToAllClients(JSON.stringify({ "event": "newConfig", "data": config }))
});

function loadConfig(){
    try {
        const data = fs.readFileSync(path.join(__dirname,"..","config.json"), { encoding: "utf8" });
        var newConfig = JSON.parse(data);
        config = mergePatch.apply(config, newConfig);
    }
    catch (err) {
        if(err === "ENOENT"){
            console.log("config.json not found, using default config");
        }
    }
}

function startWebsocketServer(){
    webSocketServer = new MyWebSocketServer( config.websocketServerPort , '0.0.0.0');

    webSocketServer.start();
}


setInterval(()=>{
    var serverStatus ={
        webSocketServer: webSocketServer.getRunningStatus(),
        webServer: serverSocket != null ? "Running" : "Stopped",
        leagueClient: webSocketServer.getStateApi().getConnectionStatus()
    }

    winConf.webContents.send("server-status", serverStatus);
}, 1000)

function setupIpcMainHandlers() {
    ipcMain.handle('load-replay-dialog', handleOpenReplayDialog);
    ipcMain.handle('update-images', checkForNewChampionImages);
    ipcMain.handle('start-web-server', handleStartWebServer);
    ipcMain.handle('stop-web-server', handleStopWebServer);
    ipcMain.handle("connect-to-client", handleConnectToClient);
    ipcMain.handle('get-config', handleGetConfig);
}

async function handleGetConfig() {
    return config;
}
async function handleOpenReplayDialog(){
    const { canceled ,filePaths} = await dialog.showOpenDialog({
        properties: ['openFile']
      })
    if (canceled) {
        return;
    }
    webSocketServer.getStateApi().loadReplay(filePaths[0]);
    return filePaths[0];
}

async function handleConnectToClient() {
    webSocketServer.getStateApi().connectToClient();
    return true;
}

function handleStartWebServer(){
    const contentBase = path.join(__dirname,"..", "build")

    const middleware = serveAsar(contentBase)

    server = express();

    server.use(express.static(path.join(__dirname,"..", "build")));

    server.use(middleware);


    server.get('/images/*', function(req,res) {
        res.sendFile(path.join(app.getPath('userData'), "images", req.params[0]))
    });

    server.get('*', function(req,res) {
        res.sendFile(path.join(__dirname,"..", "build", "index.html"))
    });

    serverSocket = server.listen(config.webserverPort, ()=>{
        console.log("server started on port "+config.webserverPort)
    });

    return "success";
}

async function handleStopWebServer(){
    serverSocket.close();
    return "success";
}

function updateImagesOnFirstStart(){
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
        return;
      }
    }
    if (isFirstTime) {
        checkForNewChampionImages();
    }
}
