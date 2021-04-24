import './App.css';
import Overlay from './default/OverlayMain';
import OverlayAlternative from "./alternate/OverlayAlternativ"
import {ChampionSelectReplay} from "./test"
import React, { useState, useEffect } from 'react';
import replay from "./assets/replay_full.json"
import parseData from "./parseData"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function App() {

  const [globalState, setGlobalState] = useState({started: false,
    bluePicks:[{},{},{},{},{}],
    redPicks:[{},{},{},{},{}],
    blueBans:[{},{},{},{},{}],
    redBans:[{},{},{},{},{}],})

	const [champSelectEnded, setChampSelectEnded] = useState(false);
//   let PB = new ChampionSelectReplay(replay);

	var pickOrderState;

	// var champSelectEnded = false;
  // console.log(replay)
  useEffect(() => {

	// let ws = new WebSocket("ws://localhost:8080")
	// var endTimeout= null;
	// ws.onopen = function(ev){
	// 	console.log(ev)
	// 	ws.send("hello")
	// }
	// ws.onmessage = function(msg) {
	// 	console.log(msg)
	// 	var msgJson = JSON.parse(msg.data)
	// 	console.log(msgJson)
	// 	if(msgJson.event==="championSelectStarted"){
	// 		setChampSelectEnded(false);
	// 		// if(endTimeout!=null)
	// 		// 	clearTimeout(endTimeout);
	// 		// endTimeout=null;
	// 	}
	// 	if(msgJson.event==="newState"){
	// 		setGlobalState(msgJson.data)
	// 	}
	// 	if(msgJson.event==="championSelectEnded"){
	// 		console.log("champSelectEnded")
	// 		// endTimeout = setTimeout(()=>{
	// 			setChampSelectEnded(true)
	// 			setGlobalState(pickOrderState)
	// 		// }, 5*60*1000)

	// 	}

	// 	if(msgJson.event==="newPickOrder"){
	// 		console.log("newPickOrder")
	// 		pickOrderState=msgJson.data;
	// 		console.log(pickOrderState)
	// 	}
	// }
	// var c =0;

	// setInterval(()=>{

	// 	var s = {
	// 		started: true,
	// 		bluePicks:[{championId: c+1},{championId: c+2},{championId: c+3},{championId: c+4},{championId: c+5}],
    // 	redPicks:[{championId: c+6},{championId: c+7},{championId: c+8},{championId: c+9},{championId: c+10}],
	// 	blueBans:[],
	// 	redBans:[],
	// 	}
	// 	c+=10;
	// 	setGlobalState(s)
	// },3000)
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
//   if(!champSelectEnded){
//   return (
//     <div className="App">
//         <Overlay state={globalState}></Overlay>
//     </div>
//   );
//   }
//   else{
// 	  return (
// 		  <div className="App">
// 			  <OverlayAlternative state={globalState}></OverlayAlternative>
// 		  </div>
// 	  )
//   }

  return (
	  <div className="App">
	<Router>
	<Switch>
	  <Route path="/" exact component={() =>     
        <Overlay state={globalState}></Overlay>} />
	  <Route path="/alt" exact component={() => <OverlayAlternative state={globalState}></OverlayAlternative>} />
	</Switch>
	</Router>
	</div>
  )
}





export default App;
