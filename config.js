

var startBtn =  document.getElementById("startBtn")
var stopBtn = document.getElementById("stopOverlayBtn")
var loadReplayBtn = document.getElementById("loadReplayBtn")
var connectToClientBtn = document.getElementById('connectToClientBtn')
var startWebServer = document.getElementById("startWebServer")
var stopWebServer = document.getElementById("stopWebServer")
var updateImages = document.getElementById("updateImages")

var consoleDiv = document.getElementById("my_console")

function log(...args){
	args.forEach(arg => consoleDiv.innerHTML+= arg+"\n")
}

startBtn.addEventListener("click", () => {
    // ipc.send("create-overlay-window", null)
	window.electronAPI.openOverlay();
    document.getElementById("stopOverlayBtn").disabled=false;
})



loadReplayBtn.addEventListener("click", () => {

	window.electronAPI.loadReplay().then(result => {
		console.log(result)
		log("Replay loaded from "+ result)
	});
	document.getElementById('connectToClientBtn').disabled = false;
})

connectToClientBtn.addEventListener('click', () => {

	window.electronAPI.connectToClient().then(_ => {
		log("Connected to client.")
	});

	document.getElementById('connectToClientBtn').disabled = true;
})

updateImages.addEventListener('click', () => {
	window.electronAPI.updateImages().then(result => {
		log("Images updated.")
	});
})

var blueColorInput = document.getElementById("blue_selected_color");
var redColorInput = document.getElementById("red_selected_color");
var timerTextColorInput = document.getElementById("timer_text_selected_color");
var blueTextColorInput = document.getElementById("blue_text_selected_color");
var redTextColorInput = document.getElementById("red_text_selected_color");
var phaseTextColorInput = document.getElementById("phase_text_selected_color");

var blueColorHex = document.getElementById("blue_color_hex")
var redColorHex = document.getElementById("red_color_hex")
var timerColorHex = document.getElementById("timer_color_hex")
var blueTextColorHex = document.getElementById("blue_text_color_hex")
var redTextColorHex = document.getElementById("red_text_color_hex")
var phaseTextColorHex = document.getElementById("phase_text_color_hex")
var blueTeamName = document.getElementById("blue_team_name")
var blueTeamSubtext = document.getElementById("blue_team_subtext")
var redTeamName = document.getElementById("red_team_name")
var redTeamSubtext = document.getElementById("red_team_subtext")
var pickingText = document.getElementById("picking_text")

blueColorInput.addEventListener("change", (ev) =>{
  blueColorHex.innerHTML = "("+ev.target.value+")"
})
redColorInput.addEventListener("change", (ev) =>{
  redColorHex.innerHTML = "("+ev.target.value+")"
})
timerTextColorInput.addEventListener("change", (ev) =>{
  timerColorHex.innerHTML = "("+ev.target.value+")"
})
blueTextColorInput.addEventListener("change", (ev) =>{
  blueTextColorHex.innerHTML = "("+ev.target.value+")"
})
redTextColorInput.addEventListener("change", (ev) =>{
  redTextColorHex.innerHTML = "("+ev.target.value+")"
})
phaseTextColorInput.addEventListener("change", (ev) =>{
  phaseTextColorHex.innerHTML = "("+ev.target.value+")"
})

var enableCustomNamesInput = document.getElementById("enable_custom_names")
var enableTransparent = document.getElementById('enable_transparent')

var blueSummonerNames = document.getElementById("blueSummonerNames").children
var redSummonerNames = document.getElementById("redSummonerNames").children
var swapNamesButton = document.getElementById("swap")
swapNamesButton.addEventListener("click", function (){

	for(var i=0;i<blueSummonerNames.length;i++){
		var tmp = blueSummonerNames[i].value;
		blueSummonerNames[i].value = redSummonerNames[i].value;
		redSummonerNames[i].value = tmp;
	}
})

window.electronAPI.getConfig().then((newConfig) => {
	config = newConfig;
	applyConfig(config);
});


function applyConfig(config){
	blueColorInput.setAttribute("value", config.blueColor)
	redColorInput.setAttribute("value", config.redColor)
	timerTextColorInput.setAttribute("value", config.timerColor)
	blueTextColorInput.setAttribute("value", config.blueTextColor)
	redTextColorInput.setAttribute("value", config.redTextColor)
	phaseTextColorInput.setAttribute("value", config.phaseTextColor)

	blueTeamName.setAttribute("value", config.blueTeamName)
	blueTeamSubtext.setAttribute("value", config.blueTeamSubtext)
	redTeamName.setAttribute("value", config.redTeamName)
	redTeamSubtext.setAttribute("value", config.redTeamSubText)
	pickingText.setAttribute("value", config.pickingText)

	enableCustomNamesInput.setAttribute("checked", config.enableCustomNames)
	enableTransparent.setAttribute("checked", config.enableTransparent)

	blueColorHex.innerHTML= "("+config.blueColor+")"
	redColorHex.innerHTML= "("+config.redColor+")"
	timerColorHex.innerHTML= "("+config.timerColor+")"
	blueTextColorHex.innerHTML= "("+config.blueTextColor+")"
	redTextColorHex.innerHTML= "("+config.redTextColor+")"
	phaseTextColorHex.innerHTML= "("+config.phaseTextColor+")"
}


var updateButton = document.getElementById("update")
updateButton.addEventListener("click",function (){
	var blueColorInput = document.getElementById("blue_selected_color");
	var redColorInput = document.getElementById("red_selected_color");
	var timerTextColorInput = document.getElementById("timer_text_selected_color");
	var names = [...blueSummonerNames].concat([...redSummonerNames]).map((el) => el.value)
	window.electronAPI.sendNewConfig({
		blueColor: blueColorInput.value,
		redColor: redColorInput.value,
		timerColor: timerTextColorInput.value,
		blueTextColor: blueTextColorInput.value,
		redTextColor: redTextColorInput.value,
		phaseTextColor: phaseTextColorInput.value,
		enableCustomNames: enableCustomNamesInput.checked,
		names: names,
		blueTeamName: blueTeamName.value,
		blueTeamSubtext: blueTeamSubtext.value,
		redTeamName: redTeamName.value,
		redTeamSubText: redTeamSubtext.value,
		pickingText: pickingText.value,
		enableTransparent: enableTransparent.checked
	});
});

var statusWebServer = document.getElementById("statusWebServer")
var statusWebSocketServer = document.getElementById("statusWebSocketServer")
var statusClient = document.getElementById("statusClient")

window.electronAPI.onNewServerStatus((event,status) =>{
	  statusWebServer.innerHTML = "Web Server: "+ status.webServer
  	  statusWebSocketServer.innerHTML = "WebSocket Server: "+ status.webSocketServer
 	  statusClient.innerHTML = "Client: "+status.leagueClient

	statusWebServer.style.backgroundColor = status.webServer =="Running" ? "var(--online-color)" : "var(--offline-color)"
	statusWebSocketServer.style.backgroundColor = status.webSocketServer =="Running" ? "var(--online-color)" : "var(--offline-color)"
	statusClient.style.backgroundColor = status.leagueClient == "Connected" ? "var(--online-color)" : "var(--offline-color)"
})

