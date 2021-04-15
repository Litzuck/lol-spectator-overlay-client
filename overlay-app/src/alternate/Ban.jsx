import React from "react"
// import "./style/pick.css"

import cx from "classnames"

export default class Ban extends React.Component {

	static defaultProps = {
		championId: 0,
		idx:0
	}

	render(){
		if(this.props.championId >0){
			return (
				<div className="banAlternate" style={{backgroundImage: `url(${require("../assets/champion/square/" + this.props.championId + ".png").default})`}} >
				</div>
			);
		}
		else{
		return (
			<div className="banAlternate" >
			</div>
		);
		}
	}
}