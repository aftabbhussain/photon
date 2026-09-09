export type MessageTypes = 'create-room' | 'join-room' | 'room-created' | 'room-joined' | 'peer-joined' | 'peer-left' | 'offer' | 'answer' | 'ice-candidate' | 'error';

export interface SignalingMessage{
  type : MessageTypes,
  payload? : any
}

export interface SignalingServiceCallbacks{
  onOpen : () => void,
  onClose : () => void,
  onMessage : (message: SignalingMessage) => void,
  onError : (err : Event) => void
}