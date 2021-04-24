import React from "react";
import cx from "classnames";
import Pick from "./Pick";
import "./style/index.css"
import Ban from "./Ban";
import ReconnectingWebSocket from "reconnecting-websocket"


export default class OverlayAlternative extends React.Component {


	static defaultProps = {
		state:{
		bluePicks:[{},{},{},{},{},],
		redPicks:[{},{},{},{},{},],
		blueBans:[{},{},{},{},{},],
		redBans:[{},{},{},{},{},],
		},
		championId: 0,
		summonerName: "test",
		idx:0
	}
	constructor(){
		super()
		this.state = {
			started: false,
			bluePicks: [
				{
					championId: 266,
					picking: false,
					summonerName: "test123",
					isCompleted: true,
					spellId1: 4,
					spellId2: 6,
				},
				{
					championId: 266,
					picking: true,
					summonerName: "test456",
					isCompleted: false,
				},
				{},
				{},
				{},
			],
			redPicks: [
				{
					championId: 0,
					picking: true,
				},
				{},
				{},
				{},
				{},
			],

			blueBans: [
				{
					championId: 1,
					isActive: false,
					isCompleted: true,
				},
				{
					championId: 22,
					isActive: false,
					isCompleted: true,
				},
				{
					championId: 0,
					isActive: true,
					isCompleted: false,
				},
				{
					championId: 0,
					isActive: false,
					isCompleted: false,
				},
				{
					championId: 0,
					isActive: false,
					isCompleted: false,
				},
			],
			redBans: [
				{
					championId: 1,
					isActive: false,
					isCompleted: true,
				},
				{
					championId: 22,
					isActive: false,
					isCompleted: true,
				},
				{
					championId: 0,
					isActive: true,
					isCompleted: false,
				},
				{
					championId: 0,
					isActive: false,
					isCompleted: false,
				},
				{
					championId: 0,
					isActive: false,
					isCompleted: false,
				},
			],
			phase: "Pick Phase 1",
			actingSide: "blue",
		};
	}


	componentDidMount(){
		// let ws = new WebSocket("ws://localhost:8080")
		let ws = new ReconnectingWebSocket("ws://localhost:8080")
		var endTimeout= null;
		let _this = this
		ws.onopen = function(ev){
			// console.log(ev)
			ws.send("hello alt")
		}
		ws.onmessage = function(msg) {
			console.log(msg)
			var msgJson = JSON.parse(msg.data)
			console.log(msgJson)
			if(msgJson.event==="championSelectStarted"){
				// setChampSelectEnded(false);
				_this.champSelectEnded = false
				// if(endTimeout!=null)
				// 	clearTimeout(endTimeout);
				// endTimeout=null;
			}
			if(msgJson.event==="newState"){
				// setGlobalState(msgJson.data)
				console.log(this)
				_this.setState(msgJson.data)
			}
			if(msgJson.event==="championSelectEnded"){
				console.log("champSelectEnded")
				_this.setState(_this.pickOrderState)
				// endTimeout = setTimeout(()=>{
					// setChampSelectEnded(true)
					// setGlobalState(pickOrderState)
				// }, 5*60*1000)
	
			}
	
			if(msgJson.event==="newPickOrder"){
				console.log("newPickOrder")
				_this.pickOrderState=msgJson.data;
				// console.log(pickOrderState)
			}
		}


	}

	render(){

		var bluePicks= [];
		var redPicks= [];

		bluePicks = this.state.bluePicks.map((pick, idx) => (
			<Pick key={"pick-" + idx}  idx={idx} side="blue"  {...pick} />
		));

		redPicks = this.state.redPicks.map((pick,idx) => (
			<Pick key={"pick-"+idx} idx={idx} side="red" {...pick}/>
		))

		var redBans= []
		var blueBans=[]



		blueBans = this.state.blueBans.map((pick,idx) =>(
			<Ban key={"pick-"+idx} idx={idx} {...pick}/>
		))

		redBans = this.state.redBans.map((pick,idx) =>(
			<Ban key={"pick-"+idx} idx={idx} {...pick}/>
		))
		return (
		<div className="main">

        <div className=" containerBlue">
            <div className="pickContainer">
                {bluePicks}

            </div>

            <div className="banContainer banBlue">
				{blueBans}

            </div>

        </div>
        <div className="midSpace">
        </div>

        <div className="containerRed">
            <div className="pickContainer">
			{redPicks}

            </div>

            <div className="banContainer banRed">
                {redBans}
            </div>

        </div>

    </div>);
	}
}