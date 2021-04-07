import React from "react"
import cx from 'classnames';
import "./style/timer.css";

export default class Timer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {time: props.time};
      }
    
      componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
          );
      }
    
      componentWillUnmount() {
        clearInterval(this.timerID);
      }

      tick() {
        this.setState(state => ({
          time: ( (state.time>0) ? state.time-1: 0)
        }));
        // this.props.time =  ( (this.props.time>0) ? this.props.time-1: 0)
      }

    componentDidUpdate(prevProps){
      if(this.props.timestamp !== prevProps.timestamp)
        this.setState(state =>({
          time: this.props.time
        }))
      // this.state.time = this.props.time
    }
    
    render(){
        // this.state.time = this.props.time
        // console.log(this.props)
        return(
            <div className={cx("timer","timer-"+this.props.side, {"visible": this.props.visible, "show-both-timers":this.props.actingSide==="none"})}>
                <div class="timer-bg"></div>
                <div className="timer-inner" id={"timer-"+this.props.side}>{ this.state.time >9 ? ":"+this.state.time: ":0"+this.state.time}</div>
                
            </div>
        )
    }
}


Timer.defaultPros = {
    side: "blue",
    visible: true,
}