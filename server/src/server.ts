import { WebSocketServer, WebSocket } from "ws";
import { SignalingMessage } from "./types/types";
import dotenv from 'dotenv'
import {RoomManager} from './roomManager'

dotenv.config();

const roomManager = new RoomManager();

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8080;
const wss = new WebSocketServer({port : PORT}, () => {
    console.log(`Signaling server initilialized at port ${PORT}`);
});

function send(socket: WebSocket, message : SignalingMessage){
    if(socket.readyState === WebSocket.OPEN){
        socket.send(JSON.stringify(message));
    }
}

wss.on('connection', (ws: WebSocket) => {
    console.log('New client established connection');
    ws.on('message', (rawData : string) => {
        try{
            const parsed : SignalingMessage = JSON.parse(rawData);
            if(!parsed.type){
                send(ws, {type: 'error', payload : {message : `Message type not specified`}});
                return;
            }
            console.log(`message intercepted of type ${parsed.type}`);
            switch(parsed.type){
                case 'create-room' : {
                    const {roomCode, peerId} = roomManager.createRoom(ws);
                    send(ws, {type : 'room-created', payload : {roomCode, peerId}});
                    break;
                }
                case 'join-room' : {
                    const {roomCode} = parsed.payload || {};
                    if(!roomCode){
                        send(ws, {type : 'error', payload : {message : 'missing roomCode parameter in the message'}});
                        return;
                    }
                    const result = roomManager.joinRoom(roomCode, ws);
                    if(result.success){
                        send(ws, {type : 'room-joined', payload : {roomCode : roomCode.toUpperCase(), peerId : result.peerId}});

                        //now send a message to the host about peer joined
                        if(result.hostSocket){
                            send(result.hostSocket, {type : 'peer-joined', payload : {peerId : result.peerId}});
                        }
                    }
                    else{
                        send(ws, {type : 'error', payload : {message : result.error}});
                    }
                    break;
                }
                case 'offer' :
                case 'answer' :
                case 'ice-candidate' : {
                    const meta = roomManager.getPeer(ws);
                    if(!meta){
                        send(ws, {type : 'error', payload : {message : 'No socket to peer mapping found, join a room first'}});
                        return;
                    }
                    const room = roomManager.getRoom(meta.roomCode);
                    if(!room){
                        return;
                    }
                    const targetPeer = room.peers.find(peer => peer.id !== meta.peerId);
                    if(targetPeer){
                        send(targetPeer.socket, {type : parsed.type, payload : {
                            ...parsed.payload,
                            senderId : meta.peerId
                        }});
                        console.log(`Relayed [${parsed.type}] from [${meta.peerId}] to [${targetPeer.id}]`);
                    }
                    else{
                        console.log(`Relay delayed for [${parsed.type}] from [${meta.peerId}]: Partner not connected yet.`);
                    }
                    break;

                }
                default :
                    send(ws, {type : 'error', payload : {message : `Action ${parsed.type} is unsupported at this stage`}});
            }
        }
        catch(err){
            send(ws, {type: 'error', payload : {message : `Invalid socket transmission intercepted`}});
        }
    });
    ws.on('close', () => {
        const closedDetails = roomManager.handleDisconnect(ws);
        if(closedDetails && closedDetails.remainingPeerSocket){
            send(closedDetails.remainingPeerSocket, {type : 'peer-left', payload : {peerId : closedDetails.peerId}});
        }
        console.log('Client closed the connection');
    });
    ws.on('error', (error) => {
        console.error('Error : ', error);
    })
})