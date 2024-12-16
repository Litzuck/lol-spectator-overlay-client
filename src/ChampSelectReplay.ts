import * as fs from "fs";
import EventEmitter from "events"
import {LCUApiInterface} from "./LCUApiInterface"

export class ChampionSelectReplay extends EventEmitter implements LCUApiInterface{

    replay:any
    callbacks: Map<string,(data:any)=> void>

    constructor(replay_file){
        super()
        try {
            var data = fs.readFileSync(replay_file)
            this.replay = JSON.parse(data.toString())
          } catch (err) {
            console.error(err)
          }
        this.callbacks = new Map();
    }
    
    request(uri: string, callback: (data: any) => void): void {
        throw new Error("Method not implemented.");
    }

    start(){
        var dataJSONs = this.replay.jsons;
        var callback = this.callbacks.get("OnJsonApiEvent_lol-champ-select_v1_session")

        dataJSONs.forEach(replayEvent => {
            var timeOffset = replayEvent.time;
            var data = replayEvent.data;
            
            // setTimeout((callback,data),timeOffset);
            setTimeout(() => {
                callback(data)
            }, timeOffset);
        });
    }

    subscribe(event:string, callback:(data:any)=> void){
        this.callbacks.set(event, callback)
    }

    getConnectedStatus():boolean{
        return false
    }
}
