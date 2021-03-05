const {
    dialog, app
  } = require("@electron/remote");
const electron = require("electron")
const ipc = electron.ipcRenderer
const request = require("request")
const fs = require("fs")


var appPath = app.getAppPath();

var splashArtDir = appPath+"/images/splash-art/centered"

var logDir = "./logs"

// console.log(appPath)

// console.log(process.resourcesPath)


document.getElementById("updateBtn").addEventListener("click", () => {

    if (!fs.existsSync(splashArtDir)){
      fs.mkdirSync(splashArtDir, {recursive:true});
    }
    request("https://ddragon.leagueoflegends.com/api/versions.json", {
    json: true
  }, (err, res, body) => {
    console.log(body);
    var latestVersion = body[0];
    request(`http://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`, {
      json: true
    }, (err, res, body) => {
      if (err) {
        return console.error(err);
      }
      console.log(res)
      console.log(body)
      Object.values(body.data).forEach((k) => {
        // console.log(k.key);
        fs.access(`${appPath}/images/splash-art/centered/${k.key}.jpg`, fs.F_OK, (err) => {
          if (err) {
            console.log(`Splash art for champion with key ${k.key} missing. \n Downloading now...`);
            download(`https://cdn.communitydragon.org/latest/champion/${k.key}/splash-art/centered`,
              `${appPath}/images/splash-art/centered/${k.key}.jpg`, () => {
                console.log("Downloaded splash for champion with key:" + k.key);
              });
            return;
          }
        });
      });
    });
  })
})


const download = (url, path, callback) => {
  request.head(url, (err, res, body) => {
    request(url)
      .pipe(fs.createWriteStream(path))
      .on('close', callback)
  })
}


document.getElementById("startBtn").addEventListener("click", () => {
    ipc.send("create-overlay-window", null)
    document.getElementById("stopOverlayBtn").disabled=false;
})

document.getElementById("fetchSummonersBtn").addEventListener("click", () => {
    ipc.send("fetch-summoner-names",null)
})

document.getElementById("stopOverlayBtn").addEventListener("click", () => {
    ipc.send("stop-overlay",null)
})


document.getElementById("loadReplayBtn").addEventListener("click", () => {
    dialog.showOpenDialog({
        properties: ['openFile']
      }).then(result => {
        if (result.filePaths.length == 1) {
            
            ipc.send("load-replay", result.filePaths[0]);
            document.getElementById("stopOverlayBtn").disabled=false;
        } else {
          console.log("No file selected.")
        }
      })
})

// window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
//     document.getElementById('my_console').innerText += errorMsg + '\r\n';
//     console.error(errorMsg, url, lineNumber);
//   }


ipc.on('overlay-stopped', (event,args) => {
    document.getElementById("stopOverlayBtn").disabled=true;
})


if (!fs.existsSync(logDir)){
  fs.mkdirSync(logDir, {recursive:true});
}

