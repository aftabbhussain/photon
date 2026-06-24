import {WebSocket} from 'ws';

export interface Peer{
    id: string,
    socket : WebSocket
}

export interface Room{
    id : string,
    code : string,
    peers : Peer[],
    ttlTimeOut : NodeJS.Timeout | null

}

export type MessageTypes = 'create-room' | 'join-room' | 'room-created' | 'room-joined' | 'peer-joined' | 'peer-left' | 'offer' | 'answer' | 'ice-candidate' | 'error';

export interface SignalingMessage{
    type : MessageTypes,
    payload? : any
}