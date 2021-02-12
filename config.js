const {
    dialog
  } = require("@electron/remote");
const electron = require("electron")
const ipc = electron.ipcRenderer
const request = require("request")
const fs = require("fs")

document.getElementById("updateBtn").addEventListener("click", () => {
    request("https://ddragon.leagueoflegends.com/api/versions.json", {
    json: true
  }, (err, res, body) => {
    console.log(body);
    var latestVersion = body[0];
    request(`http://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`, {
      json: true
    }, (err, res, body) => {
      if (err) {
        return console.log(err);
      }
      console.log(res)
      console.log(body)
      Object.values(body.data).forEach((k) => {
        // console.log(k.key);
        fs.access(`./images/splash-art/centered/${k.key}.jpg`, fs.F_OK, (err) => {
          if (err) {
            console.log(`Splash art for champion with key ${k.key} missing. \n Downloading now...`);
            download(`https://cdn.communitydragon.org/latest/champion/${k.key}/splash-art/centered`,
              `./images/splash-art/centered/${k.key}.jpg`, () => {
                console.log("Downloaded splash for champion with key:" + k.key);
              });
            return;
          }
        });
      });
    });
  })
})


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

window.onerror = function myErrorHandler(errorMsg, url, lineNumber) {
    document.getElementById('my_console').innerText += errorMsg + '\r\n';
    console.error(errorMsg, url, lineNumber);
  }


ipc.on('overlay-stopped', (event,args) => {
    document.getElementById("stopOverlayBtn").disabled=true;
})