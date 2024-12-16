
export interface LCUApiInterface {

    start():void;

    subscribe(event: string, callback:(data:any)=>void):void;
    
    request(uri:string, callback:(data:any)=>any, errorCallback?:(error:Error)=>any):void;

    getConnectedStatus():boolean;

}