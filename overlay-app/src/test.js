const { EventEmitter } = require('events')


export class ChampionSelectReplay extends EventEmitter{


    constructor(replay_file){
        super()
        this.replay = replay_file
        this.callbacks = new Map()
    }



    start(){
        var dataJSONs = this.replay.jsons;
        // var callback = this.callbacks.get("OnJsonApiEvent_lol-champ-select_v1_session")

        dataJSONs.forEach(replayEvent => {
            var timeOffset = replayEvent.time;
            var data = replayEvent.data;
            
            // setTimeout((callback,data),timeOffset);
            setTimeout(() => {
                this.emit("newEvent", data)
            }, timeOffset);
        });
    }

    subscribe(event, callback){
        this.callbacks.set(event, callback)
    }
}
