import React from "react"
import "./style/pick.css"

import cx from "classnames"

export default class Spell extends React.Component {

    static defaultProps={
        spellId:0,
    }

    render(){
        if(this.props.spellId>0 && this.props.spellId<20)
            return <img className="spell" src={require("../assets/summoner-spells/" + this.props.spellId + ".png").default} alt="" />
        else
            return <img className=""  alt="" />
    }
}