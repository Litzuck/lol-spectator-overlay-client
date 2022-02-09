import React from "react"
import "./style/pick.css"

import cx from "classnames"
import Spell from "./Spell"

export default class Pick extends React.Component {
	static defaultProps = {
		spellId1: 4,
		spellId2: 6,
		championId: 0,
		summonerName: "test",
		picking: false,
		isCompleted: false,
		pickingText: "Picking"
	}
	render() {

		let background
		if (this.props.championId > 0) {
			background = <div className="background" style={{ backgroundImage: `url(${"images/champions/splash-art/" + this.props.championId + ".png"})` }} data-id={this.props.championId}></div>
		}
		else {
			background = <div className="background"></div>
		}

		let pick = <div className={cx("summoner-object-component"
			, {
				"no-champion": this.props.championId === 0,
				"is-picking-now": this.props.isPicking,
				"champion-not-locked": this.props.isPicking,
				"champion-locked": this.props.isCompleted
			})}>
			<div className="summoner-object-wrapper">
				{background}
				<div className="action-text">{this.props.pickingText}</div>
				<div className="summoner-name">{this.props.summonerName}</div>
				<div className="spells">
					<Spell spellId={this.props.spellId1} />
					<Spell spellId={this.props.spellId2} />
				</div>
				<div className="edge-border"></div>
			</div>
		</div>

		return (
			<div className="summoner-wrapper">
				<div className="base-color-background"></div>
				<div className="gradient-background-overlay"></div>
				{pick}
			</div>
		);
	}
}

