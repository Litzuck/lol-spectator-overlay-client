import { EventEmitter} from "events";
import requestPromise from "request-promise";
import {LCUApiInterface} from "./LCUApiInterface"
import ReconnectingWebSocket from "./internal/ReconnectingWebSocket"
import { authenticate, LeagueClient} from "league-connect";

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0"

export class LCUApiWrapper extends EventEmitter implements LCUApiInterface{

    static instance: LCUApiWrapper;
    callbacks: Map<string,(data:any) => void>;
    user: string;
    authkey: string;
    password: string;
    port: number;
    ws: ReconnectingWebSocket;
    connected: boolean = false;
    credentials: any;
    client: LeagueClient;

    constructor() {
        super()

        this.callbacks = new Map();
        this.credentials = authenticate({awaitConnection: true}).then((credentials) => {
            this.connectWS(credentials);
            console.log("Credentials", credentials);
            this.client = new LeagueClient(credentials);
            console.log("Client", this.client);
            this.client.on("connect", (newCredentials) => {
                console.log("New Credentials", newCredentials);
                this.ws.close();
                this.connectWS(newCredentials);
            });

            this.client.on("disconnect", () => {
                this.ws.close();
            });

            this.client.start();
        }); 
    }


    private connectWS( credentials) {
        var authkey = Buffer.from(`riot:${credentials.password}`).toString('base64')
        this.authkey = authkey
        this.user = "riot"
        this.password = credentials.password
        this.port = credentials.port
        console.log("Connected to LCU", credentials);
        this.ws = new ReconnectingWebSocket(`wss://riot:${this.password}@127.0.0.1:${this.port}/`, "wamp", {
            origin: `https://127.0.0.1:${this.port}`,
            Host: `127.0.0.1:${this.port}`,
            Authorization: `Basic ${authkey}`
        });

        this.ws.on('unexpected-response', (msg:string) => {
            console.log("unexpected message",msg)
        })
        this.ws.on('error', (err:string) => {
            console.log("error",err)
        })
        this.ws.on('message', (msg:string) => {
            var data = JSON.parse(msg)
            var callback = this.callbacks.get(data[1])
            if (callback != null)
                callback(data[2])

        });
        this.ws.on('open', () => {
            this.callbacks.forEach( (value:any, key:string) => {
                console.log(key + " subscribed to");
                this.ws.send(`[5, "${key}"]`);
            });
            this.connected = true;
        });

        this.ws.on('close', () => {
            this.connected = false;
        });

        this.ws.connect();
    }

    start() {
    }


    subscribe(event:string, callback: (data: any) => void) {
        if (this.ws != null && this.ws.readyState() == 1) {
            this.ws.send(`[5, "${event}"]`);
        }
        this.callbacks.set(event, callback);
    }


    request(uri:string, callback:(data:any)=> void, errorCallback?:(error:Error)=>any) {
        requestPromise({
            strictSSL: false,
            url: `https://${this.user}:${this.password}@127.0.0.1:${this.port}/${uri}`,

        })
            .then((response) => callback(response))
            .catch(errorCallback)
            //.catch((err) => { console.log("Error in REST API Request.", err); });

    }

    static getInstance(){
        if(!LCUApiWrapper.instance)
            LCUApiWrapper.instance = new LCUApiWrapper()
        return LCUApiWrapper.instance;
    }

    getConnectedStatus():boolean {
        return this.connected;
    }
}