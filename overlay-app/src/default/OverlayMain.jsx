import React from "react";
import cx from "classnames";

// import css from './style/index.less';
import Ban from "./Ban";
import "./index.css";

import Pick from "./Pick";
import Timer from "./Timer";

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
	render() {
		// console.log(this.state)
		console.log(this.props.state);
		var bluePicks = [];
		var redPicks = [];

		// for(let i=0; i <5; i++){
		//     bluePicks.push(<Pick key={i}></Pick>);
		//     redPicks.push(<Pick key={i+5}></Pick>);
		// }

		bluePicks = this.props.state.bluePicks.map((pick, index) => (
			<Pick key={"pick-" + index} {...pick} />
		));
		redPicks = this.props.state.redPicks.map((pick, index) => (
			<Pick key={"pick-" + index} {...pick} />
		));

		var blueBans = [];
		var redBans = [];
		// for (let i =0; i<5; i++){
		//     blueBans.push(<Ban key={i}></Ban>)
		//     redBans.push(<Ban key={i+5}></Ban>)
		// }

		blueBans = this.props.state.blueBans.map((ban, index) => (
			<Ban key={"ban-" + index} {...ban} />
		));
		redBans = this.props.state.redBans.map((ban, index) => (
			<Ban key={"ban-" + index} {...ban} />
		));

		return (
			<div
				className="overlay"
				style={{ width: 1280, height: 720 }}
				className={cx("overlay", this.props.state.actingSide + "-acting")}
			>
				<div className="champion-select-header">
					<Timer
						side="blue"
						visible={
							this.props.state.actingSide === "blue" ||
							this.props.state.actingSide === "none"
						}
						time={this.props.state.time}
						actingSide={this.props.state.actingSide}
						timestamp={this.props.state.timestamp}
					/>
					<div className="header-keystone">
						<div className="left-bg-section"></div>
						<div className="right-bg-section"></div>
						<div className="header-keystone-inner">
							<div className="left-bg-section"></div>
							<div className="right-bg-section"></div>
							<div className="phase">{this.props.state.phase}</div>
						</div>
					</div>

					<Timer
						side="red"
						visible={
							this.props.state.actingSide === "red" ||
							this.props.state.actingSide === "none"
						}
						time={this.props.state.time}
						actingSide={this.props.state.actingSide}
						timestamp={this.props.state.timestamp}
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
