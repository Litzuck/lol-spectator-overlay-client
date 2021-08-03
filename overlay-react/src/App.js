import './App.css';
import Overlay from './default/OverlayMain';
import React, { useState, useEffect } from 'react';

import ReactDOM from "react-dom";
import { Link, useLocation, BrowserRouter as Router } from "react-router-dom";


function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function App() {
  let query = useQuery()
  return (
	  <div className="App">  
        <Overlay backend={query.has('backend') ? query.get('backend'): 'ws://localhost:8000'}></Overlay>
	</div>
  )
}





export default App;
