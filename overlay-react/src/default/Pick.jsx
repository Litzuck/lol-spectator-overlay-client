import React from "react"
import "./style/pick.css"

import cx from "classnames"

export default class Pick extends React.Component {
	static defaultProps = {
		spellId1: 4,
		spellId2: 6,
		championId: 0,
		summonerName: "test",
		picking: false,
		isCompleted: false,
	}
	render() {

		let background
		if (this.props.championId === 0) {
			background = <div className="background"></div>
		} else if (this.props.championId > 0) {
			background = <div className="background" style={{ backgroundImage: `url(${require("../assets/splash-art/centered/" + this.props.championId + ".jpg").default})` }} data-id={this.props.championId}></div>

			// pick = <div class="ban" style={{ backgroundImage: `url(${require("../assets/splash-art/centered/"+this.props.championId+".jpg").default})`}}></div>
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
				<div className="action-text">Picking</div>
				<div className="summoner-name">{this.props.summonerName}</div>
				<div className="spells">
					<img className="spell" src={require("../assets/summoner-spells/" + this.props.spellId1 + ".png").default} alt="" />
					<img className="spell" src={require("../assets/summoner-spells/" + this.props.spellId2 + ".png").default} alt="" />
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

