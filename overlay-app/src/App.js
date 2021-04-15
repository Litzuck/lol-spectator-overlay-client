import './App.css';
import Overlay from './default/OverlayMain';
import OverlayAlternative from "./alternate/OverlayAlternativ"
import {ChampionSelectReplay} from "./test"
import React, { useState, useEffect } from 'react';
import replay from "./assets/replay_full.json"
import parseData from "./parseData"

function App() {

  const [globalState, setGlobalState] = useState({started: false,
    bluePicks:[],
    redPicks:[],
    blueBans:[],
    redBans:[],})

	const [champSelectEnded, setChampSelectEnded] = useState(false);
//   let PB = new ChampionSelectReplay(replay);

	var pickOrderState;

	// var champSelectEnded = false;
  // console.log(replay)
  useEffect(() => {

	let ws = new WebSocket("ws://localhost:8080")
	ws.onopen = function(ev){
		console.log(ev)
		ws.send("hello")
	}
	ws.onmessage = function(msg) {
		console.log(msg)
		var msgJson = JSON.parse(msg.data)
		console.log(msgJson)
		if(msgJson.event==="championSelectStarted"){
			setChampSelectEnded(false);
			
		}
		if(msgJson.event==="newState"){
			setGlobalState(msgJson.data)
		}
		if(msgJson.event==="championSelectEnded"){
			console.log("champSelectEnded")
			setTimeout(()=>{
				setChampSelectEnded(true)
				setGlobalState(pickOrderState)
			}, 5000)

		}

		if(msgJson.event==="newPickOrder"){
			console.log("newPickOrder")
			pickOrderState=msgJson.data;
			console.log(pickOrderState)
		}
	}
    // PB.on('newEvent', state => {
    //   // console.log(state)
    //   setGlobalState(parseData(state))
    // });
  
    // PB.on('heartbeat', hb => {
    //     console.info(`Got new config: ${JSON.stringify(hb.config)}`);
    // });
  
    // PB.start();
	return function (){
		// PB.removeAllListeners("newEvent")
	}
  }, []);

  // console.log(globalState)

console.log(champSelectEnded)
  if(!champSelectEnded){
  return (
    <div className="App">
        <Overlay state={globalState}></Overlay>
    </div>
  );
  }
  else{
	  return (
		  <div className="App">
			  <OverlayAlternative state={globalState}></OverlayAlternative>
		  </div>
	  )
  }
}





export default App;
