const { app, BrowserWindow } = require('electron')
const ipc = require('electron').ipcMain
require('@electron/remote/main').initialize()
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

const windows = new Set();

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
    win.setContentSize(1600,900)
    win.loadFile('index.html')

    win.webContents.on('did-finish-load', () => {
        win.webContents.send('start-spectator', '')
    })

    // Open the DevTools.
    // win.webContents.openDevTools()

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
        winConf.webContents.send('overlay-stopped');
    })
}

function createReplayWindow(path) {
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
    win.setContentSize(1600,900)
    // and load the index.html of the app.
    win.loadFile('index.html')

    win.webContents.on('did-finish-load', () => {
        win.webContents.send('load-replay', path)
    })

    // Open the DevTools.
    // win.webContents.openDevTools()

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
        winConf.webContents.send('overlay-stopped');
    })
}

function createConfigWindow(){
    winConf = new BrowserWindow({
        width: 600,
        height: 400,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        },
        frame: true,
    })
    // and load the index.html of the app.
    winConf.loadFile('config.html')

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

ipc.on('create-overlay-window', function (event, arg) {
    if(win==null)
        createWindow();
    else
        win.show();
  })
ipc.on("fetch-summoner-names", function(event,args) {
    win.webContents.send("fetch-summoner-names-client", null)
})

ipc.on("load-replay", (event,path) => {
    if(win!=null)
        win.close()
    
    createReplayWindow(path);
})

ipc.on("stop-overlay", (event,path) => {
    if(win!=null)
        win.close()
})