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
				{},
				{},
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
				{}, {}, {}, {}, {},
			],
			redBans: [
				{}, {}, {}, {}, {},
			],
			phase: "Pick Phase 1",
			actingSide: "blue",
		};
		this.config = {
			blueColor: "#0b849e",
			redColor: "#be1e37",
			timerColor: "#ffffff",
			blueTextColor: "#fff",
			redTextColor: "#fff",
			phaseTextColor: "#fff",
		}
	}


	componentDidMount() {
		let ws = new ReconnectingWebSocket("ws://localhost:8080")
		var endTimeout = null;
		let _this = this
		ws.onopen = function (ev) {
			// console.log(ev)
			// ws.send("hello")
		}
		ws.onmessage = function (msg) {
			console.log(msg)
			var msgJson = JSON.parse(msg.data)
			console.log(msgJson)
			if (msgJson.event === "championSelectStarted") {
				// setChampSelectEnded(false);
				_this.champSelectEnded = false
				// if(endTimeout!=null)
				// 	clearTimeout(endTimeout);
				// endTimeout=null;
			}
			if (msgJson.event === "newState") {
				// setGlobalState(msgJson.data)
				console.log(this)
				_this.setState(msgJson.data)
			}
			if (msgJson.event === "championSelectEnded") {
				console.log("champSelectEnded")
				// endTimeout = setTimeout(()=>{
				// setChampSelectEnded(true)
				// setGlobalState(pickOrderState)
				// }, 5*60*1000)

			}
			if (msgJson.event === "newConfig") {
				console.log(msgJson.data)
				_this.config = msgJson.data
				_this.setState(_this.state)

			}

			// if(msgJson.event==="newPickOrder"){
			// 	console.log("newPickOrder")
			// 	pickOrderState=msgJson.data;
			// 	console.log(pickOrderState)
			// }
		}


	}


	render() {
		var bluePicks = [];
		var redPicks = [];

		if (this.state.bluePicks) {
			if (this.config.enableCustomNames) {
				bluePicks = this.state.bluePicks.map((pick, index) => (
					<Pick key={"pick-" + index} {...pick} summonerName={this.config.names[index]} />
				));
			}
			else {
				bluePicks = this.state.bluePicks.map((pick, index) => (
					<Pick key={"pick-" + index} {...pick} />
				));
			}
		}

		if (this.state.redPicks) {
			if (this.config.enableCustomNames) {
				redPicks = this.state.redPicks.map((pick, index) => (
					<Pick key={"pick-" + index} {...pick} summonerName={this.config.names[index + 5]} />
				));
			}
			else {
				redPicks = this.state.redPicks.map((pick, index) => (
					<Pick key={"pick-" + index} {...pick} />
				));
			}
		}

		var blueBans = [];
		var redBans = [];

		if (this.state.blueBans) {
			blueBans = this.state.blueBans.map((ban, index) => (
				<Ban key={"ban-" + index} {...ban} />
			));
		}
		if (this.state.redBans) {
			redBans = this.state.redBans.map((ban, index) => (
				<Ban key={"ban-" + index} {...ban} />
			));
		}

		var style = {
			"--left-side-color": this.config.blueColor, "--right-side-color": this.config.redColor, "--timer-color": this.config.timerColor, "width": 1280, "height": 720, "zoom": 1.25,
			"--left-side-text-color": this.config.blueTextColor, "--right-side-text-color": this.config.redTextColor, "--phase-text-color": this.config.phaseTextColor
		};

		return (
			<div
				className="overlay"
				style={style} //{{ width: 1280, height: 720 ,zoom:1.25 }}
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
							<div className={cx("phase", { "transparent": this.state.phase === "" })} >{this.state.phase}</div>
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
