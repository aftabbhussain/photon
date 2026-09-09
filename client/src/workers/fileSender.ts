import {CONFIG} from '../core/config.js';
export interface FileSenderCallbacks{
  onProgress: (bytesSent: number, totalBytes: number) => void;
  onComplete: () => void;
  onError: (error: string) => void;
}
export class FileSender{
  private dataChannel: RTCDataChannel;
  private callbacks: FileSenderCallbacks;
  private isCancelled = false;

  constructor(dataChannel: RTCDataChannel, callbacks: FileSenderCallbacks){
    this.dataChannel = dataChannel;
    this.callbacks = callbacks;
    this.dataChannel.bufferedAmountLowThreshold = CONFIG.STREAMING.BUFFER_LOW;
  }

  public async streamFile(file: File): Promise<void> {
    let offset = 0;
    const totalBytes = file.size;

    console.log(`Launching data channel transfer loop for: ${file.name} (${totalBytes} bytes)`);
    if (this.dataChannel.readyState === 'open') {
      this.dataChannel.send(JSON.stringify({
        type: 'meta',
        payload: { name: file.name, size: totalBytes }
      }));
    } else {
      this.callbacks.onError('Data channel pipeline is closed. Execution halted.');
      return;
    }
    while(offset < totalBytes && !this.isCancelled){
      if (this.dataChannel.bufferedAmount > CONFIG.STREAMING.BUFFER_HIGH){
        await new Promise<void>((resolve) =>{
          this.dataChannel.onbufferedamountlow = () => {
            this.dataChannel.onbufferedamountlow = null;
            resolve();
          };
        });
      }

      try {
        const chunk = await this.readSlice(file, offset, offset + CONFIG.STREAMING.CHUNK_SIZE);
        if (this.dataChannel.readyState !== 'open') {
          throw new Error('Data channel severed mid-stream.');
        }
        this.dataChannel.send(chunk);
        offset += chunk.byteLength;
        this.callbacks.onProgress(offset, totalBytes);
      } 
      catch(err: any){
        this.callbacks.onError(`Stream read failure: ${err?.message || err}`);
        return;
      }
    }
    if(!this.isCancelled){
      this.dataChannel.send(JSON.stringify({ type: 'eof'}));
      this.callbacks.onComplete();
      console.log('Binary stream sequence sent.');
    }
  }
  private readSlice(file: File, start: number, end: number): Promise<ArrayBuffer>{
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const slice = file.slice(start, end);
      reader.onload = (e) => {
        if(e.target?.result instanceof ArrayBuffer){
          resolve(e.target.result);
        } 
        else{
          reject(new Error('ArrayBuffer extraction parsing failure.'));
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(slice);
    });
  }
  public cancel(): void {
    this.isCancelled = true;
    console.log('Stream tracking manually cancelled by user.');
  }
}