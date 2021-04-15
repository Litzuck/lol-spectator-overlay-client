import React from "react";
import cx from "classnames";
import Pick from "./Pick";
import "./style/index.css"
import Ban from "./Ban";


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
	}

	render(){

		var bluePicks= [];
		var redPicks= [];

		bluePicks = this.props.state.bluePicks.map((pick, idx) => (
			<Pick key={"pick-" + idx}  idx={idx} side="blue"  {...pick} />
		));

		redPicks = this.props.state.redPicks.map((pick,idx) => (
			<Pick key={"pick-"+idx} idx={idx} side="red" {...pick}/>
		))

		var redBans= []
		var blueBans=[]



		blueBans = this.props.state.blueBans.map((pick,idx) =>(
			<Ban key={"pick-"+idx} idx={idx} {...pick}/>
		))

		redBans = this.props.state.redBans.map((pick,idx) =>(
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