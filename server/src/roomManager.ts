import { Peer, Room } from './types/types';
import {WebSocket} from 'ws';
import {v4 as uuidv4} from 'uuid';

const TTL = 10*60*1000;

export class RoomManager{
    private rooms = new Map<string, Room>();
    private socketToPeerMap = new Map<WebSocket, {roomCode: string, peerId : string}>();

    private generateRoomCode() : string{
        const charset = "ABCDEFGHJKMNPQRSTVWXYZ23456789";
        let res = '';
        for(let i = 0; i < 6; i++){
            res = res + charset[Math.floor(Math.random()*charset.length)];
        }
        return (this.rooms.has(res) ? this.generateRoomCode() : res);
    }
    
    public createRoom(socket : WebSocket) : {roomCode : string, peerId : string}{
        const peerId = uuidv4();
        const roomId = uuidv4();
        const roomCode = this.generateRoomCode();
        const newRoom: Room = {
            id : roomId,
            code : roomCode,
            peers : [{id : peerId, socket : socket}],
            ttlTimeOut : null
        }
        this.rooms.set(roomCode, newRoom);
        this.socketToPeerMap.set(socket, {roomCode, peerId});
        console.log(`New room created with roomCode ${roomCode} by host ${peerId}`);
        return {roomCode, peerId};
    }

    public joinRoom(roomCode : string, socket: WebSocket) : {success : boolean, peerId?: string, hostSocket? : WebSocket, error? : string}{
        const targetRoomCode = roomCode.toUpperCase();
        const room = this.rooms.get(targetRoomCode);

        if(!room){
            return {success:false, error : 'Requested room not found or the room expired'};
        }
        if(room.peers.length >= 2){
            return {success : false, error : 'Only 2 peers can join the room'};
        }
        const newPeerId = uuidv4();
        const hostPeer = room.peers[0];
        
        if(room.ttlTimeOut){
            clearTimeout(room.ttlTimeOut);
            room.ttlTimeOut = null;
            console.log(`Room timeout cleared for room ${targetRoomCode} (peer joined)`);
        }
        
        room.peers.push({id : newPeerId, socket});
        this.socketToPeerMap.set(socket, {roomCode: targetRoomCode, peerId: newPeerId});
        console.log(`Guest ${newPeerId} joined room ${targetRoomCode}`);
        //agr successfully join ho jata hai to hi success aur peerId aur hostSocket return krenge else success aur error return krenge
        return {success: true, peerId:newPeerId, hostSocket: hostPeer.socket};
    }

    public handleDisconnect(socket : WebSocket) : {peerId? : string, roomCode? : string, remainingPeerSocket? : WebSocket} | null{
        const meta = this.socketToPeerMap.get(socket);
        if(!meta){
            return null;
        }
        const {roomCode, peerId} = meta;
        const room = this.rooms.get(roomCode);
        let remainingPeerSocket : WebSocket | undefined;
        if(room){
            room.peers = room.peers.filter(peer => peer.id !== peerId);
            if(room.peers.length > 0){
                remainingPeerSocket = room.peers[0].socket;
            }
            else{
                console.log(`Room ${roomCode} is empty, setting ttl timeout of 10minutes`);
                room.ttlTimeOut = setTimeout(() => {
                    this.rooms.delete(roomCode);
                    console.log(`Room ${roomCode} cleared from memory due to inactivity`);
                }, TTL);
                
            }
        }
        this.socketToPeerMap.delete(socket);
        return {peerId, roomCode, remainingPeerSocket};
    }
    public getPeer(socket : WebSocket){
        return this.socketToPeerMap.get(socket);
    }
    public getRoom(roomCode : string){
        return this.rooms.get(roomCode.toUpperCase());
    }
}