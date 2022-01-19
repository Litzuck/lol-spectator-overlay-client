import { State } from 'lol-esports-spectate/dist/Interfaces';
import WebSocket from 'ws';
import ReplacableStateApi from './ReplacableStateApi';

export default class MyWebSocketServer {
    private wsServer: WebSocket.Server;
    private clients: Array<WebSocket>;
    private port: number;
    private host: string;
    private api: ReplacableStateApi;

    constructor(port: number, host: string) {
        this.port = port;
        this.host = host;
        this.clients = [];
    }

    public start() {

        var currentState = null;
        var currentPickOrder = null;
        var currentChampionSelectEnded = false;
        var currentChampionSelectStarted = false;

        this.api = new ReplacableStateApi();
        this.api.connectToClient();

        this.api.on('newState', (state:State)=> currentState = state);
        this.api.on('newPickOrder', (state:State)=> currentPickOrder = state);
        this.api.on('championSelectStarted', () => {currentChampionSelectStarted =true; currentChampionSelectEnded=false; })
        this.api.on('championSelectEnd', () => {currentChampionSelectEnded =true; currentChampionSelectStarted =false;})
        
        
        this.wsServer = new WebSocket.Server({ port: this.port, host: this.host });
        this.wsServer.on('connection', (ws: WebSocket) => {
            this.clients.push(ws);

            // send current status

            if (currentChampionSelectStarted)
                ws.send(JSON.stringify({ "event": "championSelectStarted" }))
            if (currentState != null)
                ws.send(JSON.stringify({ "event": "newState", "data": currentState }));
            if (currentPickOrder != null)
                ws.send(JSON.stringify({ "event": "newPickOrder", "data": currentPickOrder }))
            if (currentChampionSelectEnded)
                ws.send(JSON.stringify({ "event": "championSelectEnded" }))


            const newState = (state: State) => {
                ws.send(JSON.stringify({ "event": "newState", "data": state }))
            };

            const championSelectStarted = () => {
                ws.send(JSON.stringify({ "event": "championSelectStarted" }))
            };

            const championSelectEnded = () => {
                ws.send(JSON.stringify({ "event": "championSelectEnded" }))
            };

            const newPickOrder = (state: State) => {
                ws.send(JSON.stringify({ "event": "newPickOrder", "data": state }))
            }



            this.api.addListener("newState", newState);
            this.api.addListener("championSelectStarted", championSelectStarted);
            this.api.addListener("championSelectEnd", championSelectEnded);
            this.api.addListener("newPickOrder", newPickOrder);

            ws.on('message', (message: string) => {
                this.clients.forEach((client: WebSocket) => {
                    client.send(message);
                });
            });

            ws.on('close', () => {
                this.clients.splice(this.clients.indexOf(ws), 1);
                this.api.removeListener("newState", newState);
                this.api.removeListener("championSelectStarted", championSelectStarted);
                this.api.removeListener("championSelectEnd", championSelectEnded);
                this.api.removeListener("newPickOrder", newPickOrder);

            })
        });
    }

    getRunningStatus(){
        if(!this.wsServer){
            return "Stopped";
        }
        return "Running";
    }

    public sendToAllClients(message: string) {
        this.clients.forEach((client: WebSocket) => {
            client.send(message);
        });
    
    }

    public getStateApi() {
        return this.api;
    }
}