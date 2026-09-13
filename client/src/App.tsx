import React,{useEffect,useState,useRef,useMemo,useCallback} from "react";
import {CONFIG} from "./config/config";
import {SignalingService} from "./services/signalingService";
import {WebRTCService} from "./services/webRTCService";
import {FileSender} from "./workers/fileSender";
import {FileReceiver} from "./workers/fileReciever";
import {formatBytes} from "./utils/formatters";
import {copyToClipboard} from "./utils/clipboard";
import {useScroll,useToast,useCameraScanner} from "./hooks";
import {Header,Footer,FileTransferCard,RoomConnectionCard,AboutSection,HowItWorksSection,FaqSection,CameraScannerModal,QrModal,SettingsModal,ToastContainer} from "./components";
export default function App(){
  const isScrolled = useScroll(20);
  const [status,setStatus] = useState<string>("Connecting to signaling node...");
    const [signalingConnected,setSignalingConnected] = useState<boolean>(false);
   const [roomCode,setRoomCode] = useState<string>("");
  const [inputCode,setInputCode] = useState<string>("");
  const [activeChannel,setActiveChannel] = useState<RTCDataChannel | null>(null);
  const [webrtcState,setWebrtcState] = useState<string>("disconnected");
  const [stagedFile,setStagedFile] = useState<File | null>(null);
  const [isDragOver,setIsDragOver] = useState<boolean>(false);
  const [activeProgress,setActiveProgress] = useState<number>(0);
  const [transferredBytes,setTransferredBytes] = useState<number>(0);
  const [totalBytes,setTotalBytes] = useState<number>(0);
  const [activeFileName,setActiveFileName] = useState<string>("");
  const [isTransferring,setIsTransferring] = useState<boolean>(false);
  const [transferType,setTransferType] = useState<"upload"|"download"|"idle">("idle");
  const [settingsModalOpen,setSettingsModalOpen] = useState<boolean>(false);
  const [qrModalOpen,setQrModalOpen] = useState<boolean>(false);
  const [copiedLink,setCopiedLink] = useState<boolean>(false);
  const [copiedCode,setCopiedCode] = useState<boolean>(false);
  const {toasts,showToast} = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const roomCodeRef = useRef<string>("");
  const autoJoinRoomRef = useRef<string | null>(null);
  const signalingRef = useRef<SignalingService | null>(null);
  const webrtcRef = useRef<WebRTCService | null>(null);
  const receiverRef = useRef<FileReceiver | null>(null);
  const senderRef = useRef<FileSender | null>(null);
  const handleScanSuccess = useCallback((parsedCode:string) =>{
    setInputCode(parsedCode);
    showToast(`QR Code Scanned: Room #${parsedCode}! Connecting...`,"success");
    signalingRef.current?.send("join-room",{roomCode:parsedCode});
  },[showToast]);

  const {scannerOpen,cameraFacing,cameraError,isCameraStarting,videoRef,openScanner,closeScanner,flipCamera,startCamera} = useCameraScanner({onScanSuccess:handleScanSuccess});
  useEffect(() => {
    roomCodeRef.current = roomCode;
  },[roomCode]);

  const shareUrl = useMemo(() => {
    const code = roomCode || inputCode || "";
    if(!code)return "";
    return `${window.location.origin}${window.location.pathname}?room=${code}`;
  },[roomCode,inputCode]);

  const resetTransferState = () => {
    setStagedFile(null);
    setIsTransferring(false);
    setActiveProgress(0);
    setTransferredBytes(0);
    setTotalBytes(0);
    setActiveFileName("");
    setTransferType("idle");
  };
  const handleDisconnect = useCallback(() => {
    webrtcRef.current?.terminate();
    setActiveChannel(null);
    setWebrtcState("disconnected");
    setRoomCode("");
    setInputCode("");
    setIsTransferring(false);
    setActiveProgress(0);
    setTransferredBytes(0);
    setTotalBytes(0);
    setActiveFileName("");
    signalingRef.current?.disconnect();
    setTimeout(() => {
      signalingRef.current?.connect();
    },200);
    showToast("Session disconnected and reset.","info");
    window.location.reload();
  },[showToast]);

  useEffect(() => {
    console.log("Initializing Photon TransferPro Core...");
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get("room");
    if(roomParam){
      const code = roomParam.trim().toUpperCase();
      setInputCode(code);
      autoJoinRoomRef.current = code;
    }

    receiverRef.current = new FileReceiver({
      onMetaReceived: (name,size) => {
        setStatus(`Receiving: "${name}" (${formatBytes(size)})`);
        setIsTransferring(true);
        setTransferType("download");
        setActiveFileName(name);
        setTotalBytes(size);
        setTransferredBytes(0);
        setActiveProgress(0);
        showToast(`Incoming file: ${name}`,"info");
      },
      onProgress: (received,total) => {
        setTransferredBytes(received);
        setTotalBytes(total);
        const percent = Math.min(100,Math.round((received / total) * 100));
        setActiveProgress(percent);
      },
      onComplete: (_,name) => {
  setStatus(`Download complete: "${name}"`);
  setIsTransferring(false);
  setActiveProgress(100);
  setTransferType("idle");
  showToast(`"${name}" successfully downloaded!`,"success");
},
onError: (err) => {
  setStatus(`Download error: ${err}`);
  setIsTransferring(false);
  setTransferType("idle");
  showToast(`Transfer interrupted: ${err}`,"error");
},
});

webrtcRef.current = new WebRTCService({
  onIceCandidate: (candidate) => {
    signalingRef.current?.send("ice-candidate",{candidate});
  },
  onConnectionStateChange: (state) => {
    setWebrtcState(state);
    setStatus(`WebRTC state: ${state}`);
    if(state === "connected"){
      showToast("P2P connection established with peer!","success");
    }else if(state === "disconnected" || state === "failed"){
      setActiveChannel(null);
      showToast("Peer connection dropped.","error");
    }
  },
  onDataChannelCaptured: (channel) => {
    setActiveChannel(channel);
    channel.binaryType = "arraybuffer";
    channel.onmessage = (event) => {
      try{
        const message = typeof event.data === "string" ? JSON.parse(event.data) : null;
        if(message?.type === "cancel-transfer"){
          resetTransferState();
          showToast("File transfer cancelled by peer.","info");
          return;
        }
      }catch{}
      receiverRef.current?.handleIncomingMessage(event);
    };
  },
});

signalingRef.current = new SignalingService(CONFIG.SIGNALING_URL,{
  onOpen: () => {
    setSignalingConnected(true);
    setStatus("Signaling online. Ready.");
    if(autoJoinRoomRef.current){
      const targetRoom = autoJoinRoomRef.current;
      autoJoinRoomRef.current = null;
      showToast(`Connecting to Room #${targetRoom}...`,"info");
      signalingRef.current?.send("join-room",{roomCode:targetRoom});
    }
  },
  onClose: () => {
    setSignalingConnected(false);
    setStatus("Signaling disconnected.");
    setActiveChannel(null);
  },
  onError: (err) => {
    console.error("Signaling error:",err);
    setSignalingConnected(false);
    setStatus("Signaling connection error.");
  },
  onMessage: async (packet) => {
    switch(packet.type){
      case "room-created":
        setRoomCode(packet.payload.roomCode);
        setStatus(`Room ${packet.payload.roomCode} ready.`);
        showToast(`Room #${packet.payload.roomCode} created!`,"success");
        break;
      case "room-joined":
        setRoomCode(packet.payload.roomCode);
        setStatus(`Joined room ${packet.payload.roomCode}.`);
        showToast(`Connected to room #${packet.payload.roomCode}!`,"success");
        break;
      case "peer-joined":
        setStatus("Peer joined. Negotiating P2P link...");
        showToast("Peer joined room! Linking WebRTC...","info");
        if(webrtcRef.current){
          webrtcRef.current.initialize();
          webrtcRef.current.createLocalDataChannel("file-transfer");
          const offer = await webrtcRef.current.generateOffer();
          signalingRef.current?.send("offer",{sdp:offer});
        }
        break;
      case "offer":
        setStatus("Inbound offer received. Generating answer...");
        if(webrtcRef.current){
          webrtcRef.current.initialize();
          webrtcRef.current.setupRemoteDataChannelListener();
          const answer = await webrtcRef.current.generateAnswer(packet.payload.sdp);
          signalingRef.current?.send("answer",{sdp:answer});
        }
        break;
      case "answer":
        setStatus("Remote answer accepted.");
        await webrtcRef.current?.acceptAnswer(packet.payload.sdp);
        break;
      case "ice-candidate":
        await webrtcRef.current?.injectIceCandidate(packet.payload.candidate);
        break;
      case "peer-left":
        handleDisconnect();
        break;
      case "error":
        setStatus(`Error: ${packet.payload?.message}`);
        showToast(packet.payload?.message || "Server error","error");
        break;
    }
  },
});

signalingRef.current.connect();

return () => {
  signalingRef.current?.disconnect();
  webrtcRef.current?.terminate();
};
},[showToast,handleDisconnect]);

const handleCreateRoom = () => {
  signalingRef.current?.send("create-room");
};

const handleJoinRoom = () => {
  const clean = inputCode.trim().toUpperCase();
  if(!clean){
    showToast("Please enter a 6-character room code","error");
    return;
  }
  signalingRef.current?.send("join-room",{roomCode:clean});
};

const copyShareLink = async () => {
  if(!shareUrl)return;
  const copied = await copyToClipboard(shareUrl);
  if(copied){
    setCopiedLink(true);
    showToast("Room link copied to clipboard!","success");
    setTimeout(() => setCopiedLink(false),2500);
  }else{
    showToast("Unable to copy room link.","error");
  }
};

const copyRoomCode = async () => {
  if(!roomCode)return;
  const copied = await copyToClipboard(roomCode);
  if(copied){
    setCopiedCode(true);
    showToast("Room code copied to clipboard!","success");
    setTimeout(() => setCopiedCode(false),2500);
  }else{
    showToast("Unable to copy room code.","error");
  }
};

const handleDragOver = (e:React.DragEvent) => {
  e.preventDefault();
  setIsDragOver(true);
};

const handleDragLeave = (e:React.DragEvent) => {
  e.preventDefault();
  setIsDragOver(false);
};

const handleDrop = (e:React.DragEvent) => {
  e.preventDefault();
  setIsDragOver(false);
  if(e.dataTransfer.files && e.dataTransfer.files[0]){
    const file = e.dataTransfer.files[0];
    setStagedFile(file);
    setActiveFileName(file.name);
    setTotalBytes(file.size);
    setTransferredBytes(0);
    setActiveProgress(0);
    showToast(`Selected: ${file.name}`,"info");
    if(!roomCode && !activeChannel){
      handleCreateRoom();
    }
  }
};

  const handleFileInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
  if(e.target.files && e.target.files[0]){
    const file = e.target.files[0];
    setStagedFile(file);
    setActiveFileName(file.name);
    setTotalBytes(file.size);
    setTransferredBytes(0);
    setActiveProgress(0);
    showToast(`Selected: ${file.name}`,"info");
    if(!roomCode && !activeChannel){
      handleCreateRoom();
    }
  }
};

const handleCancelTransfer = () => {
  if(!activeChannel)return;
  activeChannel.send(JSON.stringify({type:"cancel-transfer"}));
  senderRef.current?.cancel();
  senderRef.current = null;
  resetTransferState();
  showToast("File transfer cancelled.","info");
};

const handleFileTransferStream = async () => {
  if(!activeChannel || !stagedFile){
    if(!roomCode)handleCreateRoom();
    showToast("Connect with a peer first before streaming.","error");
    return;
  }

  const currentFile = stagedFile;
  setIsTransferring(true);
  setTransferType("upload");
  setActiveFileName(currentFile.name);
  setTotalBytes(currentFile.size);
  setTransferredBytes(0);
  setActiveProgress(0);

  senderRef.current = new FileSender(activeChannel,{
    onProgress: (sent,total) => {
      setTransferredBytes(sent);
      setTotalBytes(total);
      const percent = Math.min(100,Math.round((sent / total) * 100));
      setActiveProgress(percent);
    },
    onComplete: () => {
      if(senderRef.current === null)return;
      setIsTransferring(false);
      setActiveProgress(100);
      setTransferType("idle");
      setStagedFile(null);
      showToast(`"${currentFile.name}" transfer completed!`,"success");
    },
    onError: (err) => {
      setIsTransferring(false);
      setTransferType("idle");
      showToast(`Streaming failed: ${err}`,"error");
    },
  });

  await senderRef.current.streamFile(currentFile);
};

return (
  <>
    <Header isScrolled={isScrolled} roomCode={roomCode} activeChannel={activeChannel} onDisconnect={handleDisconnect} onOpenSettings={() => setSettingsModalOpen(true)} />
    <div className="max-w-[1480px] lg:my-6 mx-auto px-3.5 md:px-8 py-3.5 md:py-7 min-h-[calc(100vh-65px)] flex flex-col" onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 items-start">
        <FileTransferCard fileInputRef={fileInputRef} stagedFile={stagedFile} isDragOver={isDragOver} isTransferring={isTransferring} activeChannel={activeChannel} transferType={transferType} activeProgress={activeProgress} activeFileName={activeFileName} transferredBytes={transferredBytes} totalBytes={totalBytes} onFileInputChange={handleFileInputChange} onCancelTransfer={handleCancelTransfer} onStartTransfer={handleFileTransferStream} />
        <RoomConnectionCard roomCode={roomCode} inputCode={inputCode} setInputCode={setInputCode} activeChannel={activeChannel} signalingConnected={signalingConnected} webrtcState={webrtcState} shareUrl={shareUrl} copiedLink={copiedLink} copiedCode={copiedCode} handleCreateRoom={handleCreateRoom} handleJoinRoom={handleJoinRoom} handleDisconnect={handleDisconnect} openScanner={openScanner} copyShareLink={copyShareLink} copyRoomCode={copyRoomCode} setQrModalOpen={setQrModalOpen} />
      </div>
    </div>
    <AboutSection />
    <HowItWorksSection />
    <FaqSection />
    <Footer />
    <CameraScannerModal isOpen={scannerOpen} onClose={closeScanner} videoRef={videoRef} cameraFacing={cameraFacing} cameraError={cameraError} isCameraStarting={isCameraStarting} onFlipCamera={flipCamera} onRetryCamera={() => startCamera(cameraFacing)} />
    <QrModal isOpen={qrModalOpen} roomCode={roomCode} shareUrl={shareUrl} copiedLink={copiedLink} onClose={() => setQrModalOpen(false)} onCopyShareLink={copyShareLink} />
    <SettingsModal isOpen={settingsModalOpen} onClose={() => setSettingsModalOpen(false)} signalingUrl={CONFIG.SIGNALING_URL} signalingConnected={signalingConnected} webrtcState={webrtcState} activeChannel={activeChannel} status={status} />
    <ToastContainer toasts={toasts} />
  </>
);
}