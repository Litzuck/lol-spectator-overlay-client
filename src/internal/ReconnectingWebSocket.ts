import EventEmitter from "events";
import WebSocket from "ws";

export default class ReconnectingWebSocket extends EventEmitter{

        /** web socket instance */
        private webSocket!: WebSocket;
        /** is connection close manually by code. */
        private manualClosed = false;
        /** ws server url */
        private wsServerUrl = '';

        private wsProtocol = '';

        private wsOptions = {};

        private reconnectingInterval

    constructor(url:string, protocol:string, options:{}, reconnectingInterval:number=5000){
        super()

        this.wsServerUrl = url;
        this.wsProtocol = protocol;
        this.wsOptions = options;
        this.reconnectingInterval = reconnectingInterval;

    }

    connect(){
        this.webSocket = new WebSocket(this.wsServerUrl,this.wsProtocol, this.wsOptions)

        this.webSocket.on('open', () => { this.onOpen(); });
        this.webSocket.on('error', (err: Error) => { this.onError(err); });
        this.webSocket.on('message', (data: WebSocket.Data) => { this.onMessage(data); });
        this.webSocket.on('close', (code: number, reason: string) => { this.onClose(code, reason); });
    
    }


    private onOpen(){
        console.log(`websocket successfully opened`);

        this.emit('open');
    }

    private onMessage(data:any){
        this.emit("message",data)
    }

    private onError(err:Error){
            console.log(`error with web-socket ${err.message}`);
        /** If connection closed manually, return. */
        if (this.manualClosed) {
            return;
        }
        /** Close connection, and let reconnect do the magic. */
        this.webSocket.close()
    }

    private onClose(code:number, reason:string){
        console.log(`websocket closed with code ${code} reason: ${reason}`);

        this.emit('close', code, reason);

        /** If connection closed manually, return. */
        if (this.manualClosed) {
            return;
        }
        /** Try to reconnect */
        this.reconnect();
    }

    private reconnect(){
        this.webSocket.removeAllListeners();

        /** Wait reconnectingInterval time */
        setTimeout(() => {
            /** If connection closed manually, and the timeout already in queue abort re-connecting. */
            if (this.manualClosed) {
                return;
            }
            console.log(`Trying to reconnect to the web-socket server...`);
            
            this.emit('reconnect');
            /** Connect again with the same url */
            this.connect();
        }, this.reconnectingInterval);
    }

    send(data:any){
        this.webSocket.send(data)
    }

    close(){
        this.manualClosed =true;
        this.webSocket.close();
    }

    readyState(){
        return this.webSocket.readyState;
    }
}