"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomManager = void 0;
const uuid_1 = require("uuid");
const TTL = 10 * 60 * 1000;
class RoomManager {
    rooms = new Map();
    socketToPeerMap = new Map();
    generateRoomCode() {
        const charset = "ABCDEFGHJKMNPQRSTVWXYZ23456789";
        let res = '';
        for (let i = 0; i < 6; i++) {
            res = res + charset[Math.floor(Math.random() * charset.length)];
        }
        return (this.rooms.has(res) ? this.generateRoomCode() : res);
    }
    createRoom(socket) {
        const peerId = (0, uuid_1.v4)();
        const roomId = (0, uuid_1.v4)();
        const roomCode = this.generateRoomCode();
        const newRoom = {
            id: roomId,
            code: roomCode,
            peers: [{ id: peerId, socket: socket }],
            ttlTimeOut: null
        };
        this.rooms.set(roomCode, newRoom);
        this.socketToPeerMap.set(socket, { roomCode, peerId });
        console.log(`New room created with roomCode ${roomCode} by host ${peerId}`);
        return { roomCode, peerId };
    }
    joinRoom(roomCode, socket) {
        const targetRoomCode = roomCode.toUpperCase();
        const room = this.rooms.get(targetRoomCode);
        if (!room) {
            return { success: false, error: 'Requested room not found or the room expired' };
        }
        if (room.peers.length >= 2) {
            return { success: false, error: 'Only 2 peers can join the room' };
        }
        const newPeerId = (0, uuid_1.v4)();
        const hostPeer = room.peers[0];
        if (room.ttlTimeOut) {
            clearTimeout(room.ttlTimeOut);
            room.ttlTimeOut = null;
            console.log(`Room timeout cleared for room ${targetRoomCode} (peer joined)`);
        }
        room.peers.push({ id: newPeerId, socket });
        this.socketToPeerMap.set(socket, { roomCode: targetRoomCode, peerId: newPeerId });
        console.log(`Guest ${newPeerId} joined room ${targetRoomCode}`);
        //agr successfully join ho jata hai to hi success aur peerId aur hostSocket return krenge else success aur error return krenge
        return { success: true, peerId: newPeerId, hostSocket: hostPeer.socket };
    }
    handleDisconnect(socket) {
        const meta = this.socketToPeerMap.get(socket);
        if (!meta) {
            return null;
        }
        const { roomCode, peerId } = meta;
        const room = this.rooms.get(roomCode);
        let remainingPeerSocket;
        if (room) {
            room.peers = room.peers.filter(peer => peer.id !== peerId);
            if (room.peers.length > 0) {
                remainingPeerSocket = room.peers[0].socket;
            }
            else {
                console.log(`Room ${roomCode} is empty, setting ttl timeout of 10minutes`);
                room.ttlTimeOut = setTimeout(() => {
                    this.rooms.delete(roomCode);
                    console.log(`Room ${roomCode} cleared from memory due to inactivity`);
                }, TTL);
            }
        }
        this.socketToPeerMap.delete(socket);
        return { peerId, roomCode, remainingPeerSocket };
    }
    getPeer(socket) {
        return this.socketToPeerMap.get(socket);
    }
    getRoom(roomCode) {
        return this.rooms.get(roomCode.toUpperCase());
    }
}
exports.RoomManager = RoomManager;
