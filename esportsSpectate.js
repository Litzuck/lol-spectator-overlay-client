const {
  Menu,
  MenuItem,
  dialog,
  app
} = require("@electron/remote");


const path = require('path');
const electron = require("electron")
const ipc = electron.ipcRenderer

ipc.send("did")

ipc.on("load-replay", function(event,path) {
  console.log("playing replay...")
  api = new ChampSelectAPI(replay = true, replay_file = path);
  registerEvenListeners();
  api.start();
});

ipc.on("start-spectator", function(event,args) {
  api= new ChampSelectAPI();
  registerEvenListeners();
  api.start();
})
ipc.on("fetch-summoner-names-client", function(event,args) {
  getNames();
})
// const {  } = remote;
const ChampSelectAPI = require("lol-esports-spectate");
// const ChampSelectAPI = require("../lib/ChampSelectApi")
var api 
var timerLeft = 0;
var timerRight = 0;
var namesEditable = false;

var appPath = app.getAppPath();

const splashArtDir = path.join(appPath,"/images/splash-art/centered")

// var menu = new Menu();

// menu.append(new MenuItem({
//   role: "fileMenu"
// }));
// menu.append(new MenuItem({
//   role: "editMenu"
// }));
// menu.append(new MenuItem({
//   role: "viewMenu"
// }));
// menu.append(new MenuItem({
//   role: "windowMenu"
// }));
// menu.append(
//   new MenuItem({
//     label: "Fetch Summoner Names",
//     click() {
//       getNames();
//     }
//   })
// );
// menu.append(
//   new MenuItem({
//     label: "Toggle Editable Summonernames",
//     click() {
//       toggleEditableNames();
//     }
//   })
// );
// menu.append(
//   new MenuItem({
//     label: "Load Replay",
//     click() {
//       dialog.showOpenDialog({
//         properties: ['openFile']
//       }).then(result => {
//         if (result.filePaths.length == 1) {
//           api = new ChampSelectAPI(replay = true, replay_file = result.filePaths[0])
//           registerEvenListeners();
//           api.start()
//         } else {
//           console.log("No file selected.")
//         }
//       })
//     }
//   })
// )
// Menu.setApplicationMenu(menu);


function registerEvenListeners() {

  api.on("championSelectStarted", data => {
    console.log("spec started");
    timerLeft = document.getElementById("timerLeft");
    timerRight = document.getElementById("timerRight");
    gameStarted = true;
  });

  api.on("championHoverChanged", (championId, actorCellId) => {
    var summoner = document.getElementById("summoner" + actorCellId);
    summoner.classList.remove("no-champion");
    summoner.classList.add("is-picking-now");
    summoner.classList.add("champion-not-locked");
    var background = document.querySelector(
      "#summoner" + actorCellId + " .background"
    );
    background.setAttribute("data-id", championId);
    let imagePath = path.normalize(path.join(splashArtDir, (championId + ".jpg")))
      console.log(imagePath);
      imagePath = imagePath.replace(/\\/g, "/");
      console.log(imagePath);
    background.setAttribute(
      "style",
      "background-image:url("+imagePath +")"
    );
  });

  api.on("championChanged", (championId, actorCellId) => {
    var summoner = document.getElementById("summoner" + actorCellId);
    var background = document.querySelector(
      "#summoner" + actorCellId + " .background"
    );
    background.setAttribute("data-id", championId);
    let imagePath = path.normalize(path.join(splashArtDir, (championId + ".jpg")))
      console.log(imagePath);
      imagePath = imagePath.replace(/\\/g, "/");
      console.log(imagePath);
    background.setAttribute(
      "style",
      "background-image:url("+imagePath +")"
    );
  });

  api.on("championLocked", (championId, actorCellId) => {
    var summoner = document.getElementById("summoner" + actorCellId);
    summoner.classList.remove("is-picking-now");
    summoner.classList.remove("champion-not-locked");
    summoner.classList.add("champion-locked");
  });

  api.on("championBanned", (championId, banTurn) => {
    var ban_wrapper = document.getElementById("ban" + banTurn);
    console.log("ban object:" + ban_wrapper);
    ban_wrapper.classList.remove("active");
    ban_wrapper.classList.add("completed");
    var ban_icon = document.querySelector("#ban" + banTurn + " .ban");
    if (championId != 0) {

      let imagePath = path.normalize(path.join(splashArtDir, (championId + ".jpg")))
      console.log(imagePath);
      imagePath = imagePath.replace(/\\/g, "/");
      console.log(imagePath);
      ban_icon.setAttribute(
        "style",
        "background-image:url("+imagePath +")"
      );
      ban_icon.setAttribute("data-id", championId);
    }
  });

  api.on("phaseChanged", newType => {
    console.log("phase changed to:" + newType);
    var main = document.getElementsByClassName(
      "champ-select-spectate-component"
    )[0];
    curPhase++;
    var phase = document.getElementsByClassName("phase")[0];
    phase.innerHTML = phases[curPhase];
    if (curPhase == 4) {
      main.classList.remove("left-side-acting");
      main.classList.remove("right-side-acting");
      main.classList.add("show-both-timers");
    }
  });

  api.on("playerTurnBegin", actorCellId => {
    var summoner = document.getElementById("summoner" + actorCellId);
    summoner.classList.add("is-picking-now");
  });

  api.on("banTurnBegin", banTurn => {
    var ban_wrapper = document.getElementById("ban" + banTurn);
    ban_wrapper.classList.add("active");
  });

  api.on("playerTurnEnd", actorCellId => {
    //TODO add fancy animations
  });

  api.on("banTurnEnd", banTurn => {
    //TODO fancy animations
  });

  api.on("newTurnBegin", timeLeftInSec => {
    console.log("reset timer");
    t = timeLeftInSec.toFixed(0);
  });

  api.on("teamTurnChanged", isAllyAction => {
    var main = document.getElementsByClassName(
      "champ-select-spectate-component"
    )[0];
    if (isAllyAction) {
      main.classList.add("left-side-acting");
      main.classList.remove("right-side-acting");
    } else {
      main.classList.remove("left-side-acting");
      main.classList.add("right-side-acting");
    }
  });

  api.on("summonerSpellChanged", (actorCellId, spellIndex, spellId) => {
    var summonerSpell = document.querySelector(
      "#summoner" + actorCellId + " .spell:nth-child(" + spellIndex + ")"
    );
    summonerSpell.setAttribute(
      "src",
      "images/summoner-spells/" + spellId + ".png"
    );
  });


}

var curPhase = 0;
var phases = [
  "Ban Phase 1",
  "Picking Phase 1",
  "Ban Phase 2",
  "Picking Phase 2",
  ""
];
var gameStarted = false;
var t = 30;
var x = setInterval(function () {
  if (t > 0 && gameStarted) {
    if (t < 10) {
      timerLeft.innerHTML = ":0" + t;
      timerRight.innerHTML = ":0" + t;
    } else {
      timerLeft.innerHTML = ":" + t;
      timerRight.innerHTML = ":" + t;
    }
    t -= 1;
  }
}, 1000);

function getNames() {
  api.request("lol-lobby/v2/lobby", getNamesCallback);
}

function getNamesCallback(response) {
  var b = JSON.parse(response);
  console.log(b);
  var blueTeam = b.gameConfig.customTeam100;
  var redTeam = b.gameConfig.customTeam200;
  var i;
  for (i = 0; i < blueTeam.length; i++) {
    var id = i;
    var name = document.querySelector("#summoner" + id + " .summoner-name");
    name.innerHTML = blueTeam[i].summonerName;
  }
  for (i = 0; i < redTeam.length; i++) {
    var id = i + 5;
    var name = document.querySelector("#summoner" + id + " .summoner-name");
    name.innerHTML = redTeam[i].summonerName;
  }
}

function toggleEditableNames() {
  names = document.getElementsByClassName("summoner-name");
  namesEditable = !namesEditable;
  for (let name of names) {
    name.setAttribute("contenteditable", namesEditable);
  }
}

// registerEvenListeners();



const request = require('request');
const fs = require('fs')


// https://ddragon.leagueoflegends.com/api/versions.json


function checkForNewChampions() {
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
}

const download = (url, path, callback) => {
  request.head(url, (err, res, body) => {
    request(url)
      .pipe(fs.createWriteStream(path))
      .on('close', callback)
  })
}



// http://ddragon.leagueoflegends.com/cdn/11.3.1/data/en_US/champion.json
// # https://cdn.communitydragon.org/latest/champion/:championKey/splash-art/centered