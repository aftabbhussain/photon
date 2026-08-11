export type StreamControlMessageType = 'meta' | 'eof';

export interface StreamControlMessage{
  type : StreamControlMessageType,
  payload? : {
    name : string,
    size : number
  }
}