import React from "react"
// import "./style/pick.css"

import cx from "classnames"

export default class Pick extends React.Component {

	static defaultProps = {
		championId: 0,
		summonerName: "test",
		idx:0
	}
	constructor(){
		super()
	}

	componentDidMount(){
		var fontSize = 100
		this.int = setInterval( ()=>{
			var pos = document.getElementById(this.props.side+this.props.idx);
			// pos.children[0].scrollWidth
			var name = pos.children[0];
			if(pos.scrollWidth<name.scrollWidth){
				fontSize*=0.9
				name.setAttribute("style",`font-size:  ${fontSize}%`) //${Math.max(Math.min(name.scrollWidth  10, 240), 160)}px`)
				// name.setAttribute("style",`letter-spacing:  ${fontSize}%`) //${Math.max(Math.min(name.scrollWidth  10, 240), 160)}px`)
			}
		},10)
	}

	componentWillUnmount(){
		clearInterval(this.int)
	}

	render(){

		let background
		if (this.props.championId > 0) {

			return(
				<div className="champion" style={{backgroundImage: `url(${require("../assets/splash-art/centered/" + this.props.championId + ".jpg").default})`}}>
					<div className="name" id={this.props.side+this.props.idx}><p>{this.props.summonerName}</p></div>
					<div className="pos">{this.props.idx +1}</div>
				</div>
			)
			}
		else{
			return (		
				<div className="champion">
					<div className="name" id={this.props.side+this.props.idx} ><p>{this.props.summonerName}</p></div>
					<div className="pos">{this.props.idx +1}</div>
				</div>
				)
		}
		return (
		<div className="champion">
			<div className="name">{this.props.summonerName}</div>
			<div className="pos">{this.props.idx +1}</div>
		</div>
	);
	}
}