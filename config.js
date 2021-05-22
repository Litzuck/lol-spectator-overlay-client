const electron = require("electron")
const ipc = electron.ipcRenderer
const request = require("request")
const fs = require("fs")

var logDir = "./logs"

document.getElementById("startBtn").addEventListener("click", () => {
    ipc.send("create-overlay-window", null)
    document.getElementById("stopOverlayBtn").disabled=false;
})

document.getElementById("stopOverlayBtn").addEventListener("click", () => {
    ipc.send("stop-overlay",null)
})

ipc.on('overlay-stopped', (event,args) => {
    document.getElementById("stopOverlayBtn").disabled=true;
})

document.getElementById("loadReplayBtn").addEventListener("click", () => {

	ipc.invoke('load-replay-dialog').then(result => {
		console.log(result)
        if (result.length == 1) {
            
            ipc.send("load-replay", result[0]);
            document.getElementById("stopOverlayBtn").disabled=false;
        } else {
          console.log("No file selected.")
        }
      })
})

if (!fs.existsSync(logDir)){
  fs.mkdirSync(logDir, {recursive:true});
}

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

var swapNamesButton = document.getElementById("swap")
swapNamesButton.addEventListener("click", function (){
	var tmp = summonerNameInput1.value
	summonerNameInput1.setAttribute("value",summonerNameInput6.value)
	summonerNameInput6.setAttribute("value",tmp)
	tmp = summonerNameInput2.value
	summonerNameInput2.setAttribute("value",summonerNameInput7.value)
	summonerNameInput7.setAttribute("value",tmp)
	tmp = summonerNameInput3.value
	summonerNameInput3.setAttribute("value",summonerNameInput8.value)
	summonerNameInput8.setAttribute("value",tmp)
	tmp = summonerNameInput4.value
	summonerNameInput4.setAttribute("value",summonerNameInput9.value)
	summonerNameInput9.setAttribute("value",tmp)
	tmp = summonerNameInput5.value
	summonerNameInput5.setAttribute("value",summonerNameInput10.value)
	summonerNameInput10.setAttribute("value",tmp)
})

var summonerNameInput1 = document.getElementById("summonerName1")
var summonerNameInput2 = document.getElementById("summonerName2")
var summonerNameInput3 = document.getElementById("summonerName3")
var summonerNameInput4 = document.getElementById("summonerName4")
var summonerNameInput5 = document.getElementById("summonerName5")
var summonerNameInput6 = document.getElementById("summonerName6")
var summonerNameInput7 = document.getElementById("summonerName7")
var summonerNameInput8 = document.getElementById("summonerName8")
var summonerNameInput9 = document.getElementById("summonerName9")
var summonerNameInput10 = document.getElementById("summonerName10")


ipc.on("newConfig", (event,newConfig) =>{
  console.log("newConfig", newConfig)
  config = newConfig;
  blueColorInput.setAttribute("value", config.blueColor)
	redColorInput.setAttribute("value", config.redColor)
	timerTextColorInput.setAttribute("value", config.timerColor)
	blueTextColorInput.setAttribute("value", config.blueTextColor)
	redTextColorInput.setAttribute("value", config.redTextColor)
	phaseTextColorInput.setAttribute("value", config.phaseTextColor)

	blueTeamName.setAttribute("value", config.blueTeamName)
	blueTeamSubtext.setAttribute("value", config.blueTeamSubtext)
	redTeamName.setAttribute("value", config.redTeamName)
	redTeamSubText.setAttribute("value", config.redTeamSubText)
	pickingText.setAttribute("value", config.pickingText)

	blueColorHex.innerHTML= "("+config.blueColor+")"
	redColorHex.innerHTML= "("+config.redColor+")"
	timerColorHex.innerHTML= "("+config.timerColor+")"
	blueTextColorHex.innerHTML= "("+config.blueTextColor+")"
	redTextColorHex.innerHTML= "("+config.redTextColor+")"
	phaseTextColorHex.innerHTML= "("+config.phaseTextColor+")"
});


ipc.send("getConfig")


var updateButton = document.getElementById("update")
updateButton.addEventListener("click",function (){
	var blueColorInput = document.getElementById("blue_selected_color");
	var redColorInput = document.getElementById("red_selected_color");
	var timerTextColorInput = document.getElementById("timer_text_selected_color");
  ipc.send("newConfig", {
		blueColor: blueColorInput.value,
		redColor: redColorInput.value,
		timerColor: timerTextColorInput.value,
		blueTextColor: blueTextColorInput.value,
		redTextColor: redTextColorInput.value,
		phaseTextColor: phaseTextColorInput.value,
		enableCustomNames: enableCustomNamesInput.checked,
		names:[
			summonerNameInput1.value,
			summonerNameInput2.value,
			summonerNameInput3.value,
			summonerNameInput4.value,
			summonerNameInput5.value,
			summonerNameInput6.value,
			summonerNameInput7.value,
			summonerNameInput8.value,
			summonerNameInput9.value,
			summonerNameInput10.value,
		],
		blueTeamName: blueTeamName.value,
		blueTeamSubtext: blueTeamSubtext.value,
		redTeamName: redTeamName.value,
		redTeamSubText: redTeamSubtext.value,
		pickingText: pickingText.value
	})
})
