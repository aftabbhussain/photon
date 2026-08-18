import { CONFIG } from "../core/config";
import type { WebRTCServiceCallbacks } from "../types/webrtcTypes";

export class WebRTCService{
    private pc : RTCPeerConnection | null = null;
    private callbacks : WebRTCServiceCallbacks;

    constructor(callbacks : WebRTCServiceCallbacks){
        this.callbacks = callbacks;
    }
    
    public initialize() : RTCPeerConnection {
        this.terminate();
        this.pc = new RTCPeerConnection(CONFIG.configuration);
        this.pc.onicecandidate = (event) => {
            if(!event.candidate) return;
            this.callbacks.onIceCandidate(event.candidate);
        }
        this.pc.onconnectionstatechange = () => {
            if(!this.pc) return;
            this.callbacks.onConnectionStateChange(this.pc?.connectionState);
        }
        return this.pc;
    }
    public createLocalDataChannel(label : string) : RTCDataChannel{
        if(!this.pc) throw new Error('RTCPeerConnection is not initiliazed');

        const channel = this.pc.createDataChannel(label, {ordered: true});
        this.callbacks.onDataChannelCaptured(channel);
        return channel;
    }
    
    public setupRemoteDataChannelListener(){
        if(!this.pc) return;

        this.pc.ondatachannel = (event) => {
            this.callbacks.onDataChannelCaptured(event.channel);
        }

    }
    public async generateOffer() : Promise<RTCSessionDescriptionInit>{
        if(!this.pc) throw new Error("RTCPeerConnection is not initialized");

        const offer = await this.pc.createOffer();
        await this.pc.setLocalDescription(offer);
        return offer;
    }
    public async generateAnswer(remoteSdp : RTCSessionDescriptionInit) : Promise<RTCSessionDescriptionInit>{
        if(!this.pc) throw new Error("RTCPeerConnection is not initialized");
        
        await this.pc.setRemoteDescription(new RTCSessionDescription(remoteSdp));
        const answer = await this.pc.createAnswer();
        await this.pc.setLocalDescription(answer);
        return answer;
    }
    public async acceptAnswer(remoteSdp : RTCSessionDescriptionInit){
        if(!this.pc) return;

        await this.pc.setRemoteDescription(new RTCSessionDescription(remoteSdp));
    }
    public async injectIceCandidate(candidateInit : RTCIceCandidateInit){
        if(!this.pc) return;
    
        await this.pc.addIceCandidate(new RTCIceCandidate(candidateInit));
        
    }
    public terminate(){
        if(!this.pc) return;

        this.pc.close();
        this.pc = null;
    }

}