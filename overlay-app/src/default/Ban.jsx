import React from "react"
import "./style/ban.css"

import cx from "classnames"



export default class Ban extends React.Component {
    render(){

        let ban;
        if(this.props.championId===0)
          ban = <div class="ban" ></div>
        else if(this.props.championId>0){
          ban = <div class="ban" style={{ backgroundImage: `url(${require("../assets/splash-art/centered/"+this.props.championId+".jpg").default})`}}></div>
        }
        else{
          ban = <div class="ban" ></div>
        }
        
        return (
          <div class="ban-wrapper" className={cx("ban-wrapper", {"active": this.props.isActive, "completed":this.props.isCompleted})}>
            <div class="ban-background">
              <div class="ban-container">
                
                {ban}
              </div>
            </div>
            <div class="ban-icon"></div>
          </div>
        )
    }
}
