export interface State{
    turnId: number;
    started: boolean;
    bluePicks: Array<Pick>;
    redPicks:Array<Pick>;
    blueBans:Array<Ban>;
    redBans:Array<Ban>;
    time:number;
    timestamp:number;
    actingSide:string;
    phase:string;
}

export interface Pick{
    championId:number;
    isCompleted:boolean;
    isPicking:boolean;
    spellId1:number;
    spellId2:number;
    summonerName:string;
}

export interface Ban{
    championId:number;
    isActive:boolean;
    isCompleted:boolean;
}

