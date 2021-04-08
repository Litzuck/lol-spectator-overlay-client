
var lastState;

function parseData (data){

	if(data.eventType==="Delete")
		return lastState;
    data = data.data
    console.log(data)
    var state = {
        started: true,
        bluePicks:[{},{},{},{},{}],
        redPicks:[{},{},{},{},{}],
        blueBans:[{},{},{},{},{}],
        redBans:[{},{},{},{},{}],
        timer: 60,
        actingSide: "none",
        timestamp: 0,
    }


    // for(let i =0; i <data.bans.myTeamBans.length;i++){
    //     state.blueBans[i].championId = data.bans.myTeamBans[i];
    // }

    var blueBanCounter=0
    var redBanCounter=0
    var bluePickCounter=0
    var redPickCounter=0
    var currentActionIsAlly= false
    data.actions.forEach(action => {
        var actionData = action[0];
        if(actionData.type==="ban"){
            let ban = {championId: actionData.championId, isCompleted: actionData.completed, isActive: actionData.isInProgress}
            if(actionData.isAllyAction){
                state.blueBans[blueBanCounter]= ban;
                blueBanCounter++;
            }
            else{
                state.redBans[redBanCounter] = ban;
                redBanCounter++;
            }
        }

        else if(actionData.type==="pick"){
            let pick = {championId: actionData.championId, isCompleted: actionData.completed, picking: actionData.isInProgress, }
            if(actionData.isAllyAction){
                state.bluePicks[bluePickCounter]= pick;
                bluePickCounter++;
            }
            else{
                state.redPicks[redPickCounter] = pick;
                redPickCounter++;
            }
        }

        if(actionData.isInProgress)
            currentActionIsAlly = actionData.isAllyAction
    });

    for(let i = 0; i<data.myTeam.length; i++){
        state.bluePicks[i].spellId1 = data.myTeam[i].spell1Id
        state.bluePicks[i].spellId2 = data.myTeam[i].spell2Id
    }

    for(let i = 0; i<data.theirTeam.length; i++){
        state.redPicks[i].spellId1 = data.theirTeam[i].spell1Id
        state.redPicks[i].spellId2 = data.theirTeam[i].spell2Id
    }
    // data.bans.myTeamBans.forEach(ban => {
    //     state.blueBans({championId: ban})
    // });

    // data.bans

    if(data.timer.phase==="BAN_PICK"){
        if(data.actions[data.actions.length-1][0].type==="ban"){ //BAN PHASE
            state.phase="Ban Phase"
        }
        else{ //PICK PHASE
            state.phase="Pick Phase"
        }
    }
    else{
        state.phase = ""
    }
    state.time = Math.trunc( data.timer.adjustedTimeLeftInPhase/1000)

    if(data.timer.phase==="BAN_PICK"){
        if(currentActionIsAlly)
            state.actingSide="blue"
        else
            state.actingSide="red"
    }
    else{
        state.actingSide="none"
    }

    state.timestamp = data.timer.internalNowInEpochMs

	lastState =state
    return state

}

export default parseData