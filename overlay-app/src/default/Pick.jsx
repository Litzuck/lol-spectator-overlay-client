import React from "react"
import "./style/pick.css"

import cx from "classnames"

export default class Pick extends React.Component {
  static defaultProps = {
    spellId1:4,
    spellId2:6,
    championId: 0,
    summonerName: "test",
    picking:false,
    isCompleted:false,
  }
    render(){

      let background
        if(this.props.championId===0){
          background = <div class="background"></div>
        } else if(this.props.championId>0){
          background = <div class="background" style={{ backgroundImage: `url(${require("../assets/splash-art/centered/"+this.props.championId+".jpg").default})`}}></div>
          
          // pick = <div class="ban" style={{ backgroundImage: `url(${require("../assets/splash-art/centered/"+this.props.championId+".jpg").default})`}}></div>
        }

        let pick = <div className={cx("summoner-object-component"
      ,{
        "no-champion": this.props.championId === 0,
        "is-picking-now": this.props.picking,
        "champion-not-locked": this.props.picking,
        "champion-locked": this.props.isCompleted
      })}>
        <div class="summoner-object-wrapper">
        {background}
        <div class="action-text">Picking</div>
        <div class="summoner-name">{this.props.summonerName}</div>
        <div class="spells">
          <img class="spell" src={require("../assets/summoner-spells/"+this.props.spellId1+".png").default} alt="" />
          <img class="spell" src={require("../assets/summoner-spells/"+this.props.spellId2+".png").default} alt=""/>
        </div>
        <div class="edge-border"></div>
      </div>
    </div>

        return (
            <div class="summoner-wrapper">
            <div class="base-color-background"></div>
            <div class="gradient-background-overlay"></div>
            {pick}
          </div>
        );
    }
}

