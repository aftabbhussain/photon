export type StreamControlMessageType = 'meta' | 'eof';

export interface StreamControlMessage{
  type : StreamControlMessageType,
  payload? : {
    name : string,
    size : number
  }
}
export interface WebRTCServiceCallbacks{
  onIceCandidate : (candidate : RTCIceCandidate) => void,
  onConnectionStateChange : (state : RTCPeerConnectionState) => void,
  onDataChannelCaptured : (channel : RTCDataChannel) => void
}