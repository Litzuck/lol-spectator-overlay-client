import './App.css';
import Overlay from './default/OverlayMain';
import React from 'react';


function useQuery() {
  return new URLSearchParams(window.location.search);
}

function App() {
  try{
    let query = useQuery()
    return (
      <div className="App">  
          <Overlay backend={query.has('backend') ? query.get('backend'): `ws://${window.location.hostname}:36502`}></Overlay>
    </div>
    )
  }catch(e){
    console.error(e);
    return (
      <div className="App">  
          <Overlay></Overlay>
    </div>
    )
  }
}




export default App;
