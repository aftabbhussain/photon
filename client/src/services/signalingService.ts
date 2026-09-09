import type { SignalingMessage, MessageTypes, SignalingServiceCallbacks } from "../types/signalingTypes";

export class SignalingService{
    private ws : WebSocket | null = null;
    private callbacks : SignalingServiceCallbacks;
    private url : string;
    
    constructor(url : string, callbacks : SignalingServiceCallbacks){
        this.url = url;
        this.callbacks = callbacks;
    }

    public connect(){
        if(this.ws) return;
        this.ws = new WebSocket(this.url);
        this.ws.onopen = () => this.callbacks.onOpen();
        this.ws.onclose = () => {
            this.ws = null; 
            this.callbacks.onClose();
        }
        this.ws.onmessage = (event) => {
            const message : SignalingMessage = JSON.parse(event.data);
            this.callbacks.onMessage(message);
        }
        this.ws.onerror = (err) => this.callbacks.onError(err);
    }
    public send(type : MessageTypes, payload? : any){
        if(!this.ws || this.ws.readyState !== this.ws.OPEN){
            console.warn(`Can't send message of type ${type}, Socket uninitialized or closed!`);
            return;

        }
        this.ws.send(JSON.stringify({type, payload}));

    }
    public disconnect(){
        if(this.ws){
            this.ws.close();
            this.ws = null;
        }
    }
}