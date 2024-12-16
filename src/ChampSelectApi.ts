import {LCUApiWrapper} from "./LCUApiWrapper";
import EventEmitter from "events";
import * as path from "path";
import {ChampionSelectReplay} from "./ChampSelectReplay";
import {LCUApiInterface} from "./LCUApiInterface"
import { EventData } from "./internal/ExternalInterfaces";
export class ChampSelectApi extends EventEmitter{

    api: LCUApiInterface;

    constructor(replay = false, replay_file = "", log_path = "logs/") {
        super()

        var _this:ChampSelectApi = this
        var lastAction: any
        var lastData: any
        var lastActionIdx = 0
        if (replay) {
            this.api = new ChampionSelectReplay(replay_file)
        } else {
            this.api = new LCUApiWrapper()
        }
        var start = Date.now()
        var json_data = {
            "jsons": []
        }

        this.api.subscribe("OnJsonApiEvent_lol-champ-select_v1_session", function (data:EventData) {
            json_data.jsons.push({
                "time": Date.now() - start,
                "data": data
            })


            if (data.eventType == "Delete") {
                if (replay == false) {
                    let now = Date.now();
                    var fs = require('fs');
                    var log_file = path.join(log_path, 'replay_' + now + '.json')
                    fs.writeFile(log_file, JSON.stringify(json_data), 'utf8', (err) => {
                        if (err) throw err;
                        console.log('The replay file has been saved!');
                    });
                }
            } else {

                if (data.data.timer.phase == "GAME_STARTING") {
                    _this.emit('champSelectFinished')
                }

                var actions = data.data.actions
                var latestActionIdx = actions.length - 1
                var latestAction = actions[latestActionIdx][0]
                for (let i = actions.length - 1; i >= 0; i--) {
                    if (actions[i][0].isInProgress) {
                        latestAction = actions[i][0]
                        latestActionIdx = i
                        break
                    }
                }

                if (data.eventType == "Create") {

                    start = Date.now()
                    json_data.jsons[0].time = 0
                    console.log("Champ select started")
                    _this.emit('championSelectStarted', data.data)

                    _this.emit('banTurnBegin', latestAction.pickTurn)
                    _this.emit('newTurnBegin', data.data.timer.adjustedTimeLeftInPhase / 1000)
                    
                    for (let i = 0; i < data.data.myTeam.length; i++) {
                        _this.emit('summonerSpellChanged', i, 1, data.data.myTeam[i].spell1Id)
                        _this.emit('summonerSpellChanged', i, 2, data.data.myTeam[i].spell2Id)
                    }
                    for (let i = 0; i < data.data.theirTeam.length; i++) {
                        _this.emit('summonerSpellChanged', i + 5, 1, data.data.theirTeam[i].spell1Id)
                        _this.emit('summonerSpellChanged', i + 5, 2, data.data.theirTeam[i].spell2Id)
                    }
                } else if (data.eventType == "Update") {
                    var cdata = data.data

                    _this.emit('newTurnBegin', cdata.timer.adjustedTimeLeftInPhase / 1000)
                    if (lastAction.id == latestAction.id) {
                        if (lastAction.championId != latestAction.championId) {
                            if (lastAction.type == "pick") {
                                _this.emit('championHoverChanged', latestAction.championId, latestAction.actorCellId)
                            }
                        }
                        if (latestAction.completed) {
                            if (latestAction.type == "pick") {
                                _this.emit('championLocked', latestAction.championId, latestAction.actorCellId)
                            } else if (latestAction.type == "ban") {
                                let banTurn = latestAction.pickTurn
                                if (latestActionIdx > 6)
                                    banTurn += 6
                                _this.emit('championBanned', latestAction.championId, banTurn)
                            }

                            if (latestActionIdx == 19) {
                                _this.emit('phaseChanged', "finalStage")
                            }

                            for (let i = 0; i < cdata.myTeam.length; i++) {
                                if (cdata.myTeam[i].championId != lastData.myTeam[i].championId) {
                                    _this.emit('championChanged', cdata.myTeam[i].championId, cdata.myTeam[i].cellId)
                                }
                            }
                            for (let i = 0; i < cdata.theirTeam.length; i++) {
                                if (cdata.theirTeam[i].championId != lastData.theirTeam[i].championId) {
                                    _this.emit('championChanged', cdata.theirTeam[i].championId, cdata.theirTeam[i].cellId)
                                }
                            }
                        }
                    } else {
                        if (latestActionIdx > 0 && actions[lastActionIdx][0].completed) {
                            if (lastAction.type == "pick") {
                                _this.emit('championLocked', actions[lastActionIdx][0].championId, actions[lastActionIdx][0].actorCellId)
                            } else if (lastAction.type == "ban") {
                                let banTurn = actions[lastActionIdx][0].pickTurn
                                if (latestActionIdx > 6)
                                    banTurn += 6
                                _this.emit('championBanned', actions[lastActionIdx][0].championId, banTurn)
                            }
                        }

                        if (lastAction.isAllyAction != latestAction.isAllyAction) {
                            _this.emit('teamTurnChanged', latestAction.isAllyAction)
                        }

                        if (lastAction.type != latestAction.type) {
                            _this.emit('phaseChanged', latestAction.type)
                        }


                        if (latestAction.type == "pick") {
                            _this.emit('playerTurnBegin', latestAction.actorCellId)
                        } else if (latestAction.type == "ban") {
                            let banTurn = latestAction.pickTurn
                            if (latestActionIdx > 6)
                                banTurn += 6
                            _this.emit('banTurnBegin', banTurn)
                        }

                        if (lastAction.type == "pick") {
                            _this.emit('playerTurnEnd', lastAction.actorCellId)
                        } else if (lastAction.type == "ban") {
                            let banTurn = actions[lastActionIdx][0].pickTurn
                            if (lastActionIdx > 6)
                                banTurn += 6
                            _this.emit('banTurnEnd', banTurn)
                        }
                    }
                    for (let i = 0; i < cdata.myTeam.length; i++) {
                        if (cdata.myTeam[i].spell1Id != lastData.myTeam[i].spell1Id) {
                            _this.emit('summonerSpellChanged', i, 1, cdata.myTeam[i].spell1Id)
                        }
                        if (cdata.myTeam[i].spell2Id != lastData.myTeam[i].spell2Id) {
                            _this.emit('summonerSpellChanged', i, 2, cdata.myTeam[i].spell2Id)
                        }
                    }
                    for (let i = 0; i < cdata.theirTeam.length; i++) {
                        if (cdata.theirTeam[i].spell1Id != lastData.theirTeam[i].spell1Id) {
                            _this.emit('summonerSpellChanged', i + 5, 1, cdata.theirTeam[i].spell1Id)
                        }
                        if (cdata.theirTeam[i].spell2Id != lastData.theirTeam[i].spell2Id) {
                            _this.emit('summonerSpellChanged', i + 5, 2, cdata.theirTeam[i].spell2Id)
                        }
                    }
                }

                lastData = data.data
                lastAction = latestAction
                lastActionIdx = latestActionIdx
            }
        })
    }

    start() {
        this.api.start()
    }


    request(uri, callback) {
        this.api.request(uri, callback)
    }
}