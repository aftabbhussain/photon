export interface FileReceiverCallbacks{
  onMetaReceived: (name: string, size: number) => void;
  onProgress: (bytesReceived: number, totalBytes: number) => void;
  onComplete: (downloadUrl: string, name: string) => void;
}
export class FileReceiver{
  private callbacks: FileReceiverCallbacks;
  private chunks: ArrayBuffer[] = [];
  private bytesReceived = 0;
  public fileName = '';
  public fileSize = 0;
  constructor(callbacks: FileReceiverCallbacks){
    this.callbacks = callbacks;
  }
  public handleIncomingMessage(event: MessageEvent): void{
    const data = event.data;
    if(data instanceof ArrayBuffer){
      this.chunks.push(data);
      this.bytesReceived += data.byteLength;
      this.callbacks.onProgress(this.bytesReceived, this.fileSize);
      return;
    }
    try{
      const packet = JSON.parse(data);
      if(packet.type === 'meta'){
        this.chunks = [];
        this.bytesReceived = 0;
        this.fileName = packet.payload.name;
        this.fileSize = packet.payload.size;
        this.callbacks.onMetaReceived(this.fileName, this.fileSize);
      } 
      else if(packet.type === 'eof'){
        console.log(`Stream end marker received, reassembling ${this.chunks.length} blocks`);
        const unifiedBlob = new Blob(this.chunks, { type: 'application/octet-stream' });
        const downloadUrl = URL.createObjectURL(unifiedBlob);
        this.callbacks.onComplete(downloadUrl, this.fileName);
        this.triggerNativeDownload(downloadUrl, this.fileName);
        this.chunks = [];
        this.bytesReceived = 0;
      }
    } 
    catch(err){
      console.error('Data channel receiver caught unparseable text transmission:', err);
    }
  }
  private triggerNativeDownload(url: string, name: string): void{
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = name;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }
}