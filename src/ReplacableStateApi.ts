import { EventEmitter } from 'events';
import { ChampSelectStateApi} from 'lol-esports-spectate'
import { State } from 'lol-esports-spectate/dist/Interfaces';


export default class ReplacableStateApi extends EventEmitter{

    private stateApi: ChampSelectStateApi;
    private clientStateApi: ChampSelectStateApi;

    constructor(){
        super();
    }


    connectToClient(){
        if(this.stateApi){
            this.stateApi.removeAllListeners();
            this.stateApi.stop();
            if(this.stateApi.replay){
                if(this.clientStateApi)
                    this.stateApi = this.clientStateApi;
                else{
                    this.clientStateApi = new ChampSelectStateApi();
                    this.stateApi = this.clientStateApi;
                }

            }
            
        }else{
        this.stateApi = new ChampSelectStateApi();
        this.clientStateApi = this.stateApi;
        }
        this.stateApi.on('newState', (state:State)=> this.onNewState(state));
        this.stateApi.on('newPickOrder', (state:State) => this.onNewPickOrder(state));
        this.stateApi.on('championSelectStarted', () => this.onChampionSelectStarted());
        this.stateApi.on('championSelectEnd', ()=> this.onChampionSelectEnded());
        
    }

    loadReplay(replay_file:string){
        if(this.stateApi){
            this.stateApi.removeAllListeners();
            if(!this.stateApi.replay){
                this.clientStateApi = this.stateApi;
            }
        }

        this.stateApi = new ChampSelectStateApi(true,replay_file);

        this.stateApi.on('newState', (state:State)=> this.onNewState(state));
        this.stateApi.on('newPickOrder', (state:State) => this.onNewPickOrder(state));
        this.stateApi.on('championSelectStarted', () => this.onChampionSelectStarted());
        this.stateApi.on('championSelectEnd', ()=> this.onChampionSelectEnded());
    }
    onChampionSelectEnded(): void {
        this.emit('championSelectEnd');
    }

    onChampionSelectStarted(): void {
        this.emit('championSelectStarted')
    }
    onNewPickOrder(state: State): void {
        this.emit('newPickOrder', state)
    }
    onNewState(state: State): void {
        this.emit('newState', state);
    }

    getConnectionStatus(){
        return this.stateApi.getConnectionStatus();
    }
}