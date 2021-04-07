import './App.css';
import Overlay from './default/OverlayMain';
import ChampionSelectReplay from "./test"
import React, { useState, useEffect } from 'react';
import replay from "./assets/replay_full.json"
import parseData from "./parseData"
function App() {

  const [globalState, setGlobalState] = useState({started: false,
    bluePicks:[],
    redPicks:[],
    blueBans:[],
    redBans:[],})
  let PB = new ChampionSelectReplay(replay);
  // console.log(replay)
  useEffect(() => {
    PB.on('newEvent', state => {
      // console.log(state)
      setGlobalState(parseData(state))
    });
  
    // PB.on('heartbeat', hb => {
    //     console.info(`Got new config: ${JSON.stringify(hb.config)}`);
    // });
  
    PB.start();
  }, []);

  // console.log(globalState)
  return (
    <div className="App">
        <Overlay state={globalState}></Overlay>
    </div>
  );
}





export default App;
