import React from "react"
import cx from 'classnames';
import "./style/timer.css";

export default class Timer extends React.Component {

  constructor(props) {
    super(props);
    this.state = { time: props.time };
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
      time: ((state.time > 0) ? state.time - 1 : 0)
    }));
    // this.props.time =  ( (this.props.time>0) ? this.props.time-1: 0)
  }

  componentDidUpdate(prevProps) {
    if (this.props.timestamp !== prevProps.timestamp)
      this.setState(state => ({
        time: this.props.time
      }))
    // this.state.time = this.props.time
  }


  timeToString(time){
		let string= ""
		let mins = Math.floor(time/60)
		let secs = time%60
		if(mins>0)
			string+= mins
		string+=":"
		if(secs<10)
			string+="0"
		string+=secs

		return string
  }


  //{this.state.time > 9 ? ":" + this.state.time : ":0" + this.state.time}
  render() {
    // this.state.time = this.props.time
    // console.log(this.props)
    return (
      <div className={cx("timer", "timer-" + this.props.side, { "visible": this.props.visible, "show-both-timers": this.props.actingSide === "none" })}>
        <div className="timer-bg"></div>
        <div className="timer-inner" id={"timer-" + this.props.side}>{this.timeToString(this.state.time)}</div>

      </div>
    )
  }
}


Timer.defaultPros = {
  side: "blue",
  visible: true,
}