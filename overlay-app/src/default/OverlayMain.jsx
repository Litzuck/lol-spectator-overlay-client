import React, { useEffect } from "react";
import cx from "classnames";

// import css from './style/index.less';
import Ban from "./Ban";
import "./index.css";
import "./style/index_alt.css"
import Pick from "./Pick";
import Timer from "./Timer";
import ReconnectingWebSocket from "reconnecting-websocket"

export default class Overlay extends React.Component {
	constructor(props) {
		super(props);
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
		let ws = new ReconnectingWebSocket("ws://localhost:8080")
		var endTimeout= null;
		let _this = this
		ws.onopen = function(ev){
			// console.log(ev)
			// ws.send("hello")
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
				// endTimeout = setTimeout(()=>{
					// setChampSelectEnded(true)
					// setGlobalState(pickOrderState)
				// }, 5*60*1000)
	
			}
	
			// if(msgJson.event==="newPickOrder"){
			// 	console.log("newPickOrder")
			// 	pickOrderState=msgJson.data;
			// 	console.log(pickOrderState)
			// }
		}


	}


	render() {
		// console.log(this.state)
		// console.log(this.props.state);
		var bluePicks = [];
		var redPicks = [];

		// for(let i=0; i <5; i++){
		//     bluePicks.push(<Pick key={i}></Pick>);
		//     redPicks.push(<Pick key={i+5}></Pick>);
		// }

		bluePicks = this.state.bluePicks.map((pick, index) => (
			<Pick key={"pick-" + index} {...pick} />
		));
		redPicks = this.state.redPicks.map((pick, index) => (
			<Pick key={"pick-" + index} {...pick} />
		));

		var blueBans = [];
		var redBans = [];
		// for (let i =0; i<5; i++){
		//     blueBans.push(<Ban key={i}></Ban>)
		//     redBans.push(<Ban key={i+5}></Ban>)
		// }

		blueBans = this.state.blueBans.map((ban, index) => (
			<Ban key={"ban-" + index} {...ban} />
		));
		redBans = this.state.redBans.map((ban, index) => (
			<Ban key={"ban-" + index} {...ban} />
		));


		return (
			<div
				className="overlay"
				style={{ width: 1280, height: 720 ,zoom:1.25}}
				className={cx("overlay", this.state.actingSide + "-acting")}
			>
				<div className="champion-select-header">
					<Timer
						side="blue"
						visible={
							this.state.actingSide === "blue" ||
							this.state.actingSide === "none"
						}
						time={this.state.time}
						actingSide={this.state.actingSide}
						timestamp={this.state.timestamp}
					/>
					<div className="header-keystone">
						<div className="left-bg-section"></div>
						<div className="right-bg-section"></div>
						<div className="header-keystone-inner">
							<div className="left-bg-section"></div>
							<div className="right-bg-section"></div>
							<div className={cx("phase",{"transparent":this.state.phase===""})} >{this.state.phase}</div>
						</div>
					</div>

					<Timer
						side="red"
						visible={
							this.state.actingSide === "red" ||
							this.state.actingSide === "none"
						}
						time={this.state.time}
						actingSide={this.state.actingSide}
						timestamp={this.state.timestamp}
					/>
				</div>

				<div className="party" id="blueParty">
					{bluePicks}
				</div>

				<div className="party" id="redParty">
					{redPicks}
				</div>

				<div className="champSelectFooter">
					<div className="bans" id="blueBans">
						{blueBans}
					</div>

					<div className="bans" id="redBans">
						{redBans}
					</div>
				</div>
			</div>
		);
	}
}
