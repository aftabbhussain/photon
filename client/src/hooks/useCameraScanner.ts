import {useState,useRef,useCallback,useEffect} from "react";
import jsQR from "jsqr";
import {parseRoomCodeFromQr} from "../utils/qr";
interface UseCameraScannerProps{
  onScanSuccess:(code:string)=>void;
}
export function useCameraScanner({onScanSuccess}:UseCameraScannerProps){
  const [scannerOpen,setScannerOpen] = useState<boolean>(false);
  const [cameraFacing,setCameraFacing] = useState<"environment"|"user">("environment");
  const [cameraError,setCameraError] = useState<string|null>(null);
  const [isCameraStarting,setIsCameraStarting] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement|null>(null);
  const canvasRef = useRef<HTMLCanvasElement|null>(null);
  const animFrameRef = useRef<number|null>(null);
  const streamRef = useRef<MediaStream|null>(null);
  const stopCamera = useCallback(()=>{
    if(animFrameRef.current){
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if(streamRef.current){
      streamRef.current.getTracks().forEach((t)=>t.stop());
      streamRef.current = null;
    }
    if(videoRef.current){
      videoRef.current.srcObject = null;
    }
    setIsCameraStarting(false);
  },[]);

  const scanFrame = useCallback(()=>{
    if(!videoRef.current||!streamRef.current)return;
    const video = videoRef.current;
    if(video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA&&video.videoWidth > 0){
      if(!canvasRef.current){
        canvasRef.current = document.createElement("canvas");
      }
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d",{willReadFrequently:true});
      if(ctx){
        ctx.drawImage(video,0,0,canvas.width,canvas.height);
        const imgData = ctx.getImageData(0,0,canvas.width,canvas.height);
        const qrCodeResult = jsQR(imgData.data,imgData.width,imgData.height,{
          inversionAttempts:"dontInvert",
        });
        if(qrCodeResult&&qrCodeResult.data){
          const parsedCode = parseRoomCodeFromQr(qrCodeResult.data);
          if(parsedCode){
            if(typeof navigator !== "undefined"&&"vibrate" in navigator){
              try{
                navigator.vibrate(100);
              }catch{}
            }
            stopCamera();
            setScannerOpen(false);
            onScanSuccess(parsedCode);
            return;
          }
        }
      }
    }
    animFrameRef.current = requestAnimationFrame(scanFrame);
  },[stopCamera,onScanSuccess]);

  const startCamera = useCallback(
    async(facing:"environment"|"user")=>{
      stopCamera();
      setCameraError(null);
      setIsCameraStarting(true);
      if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){
        setCameraError(
          "Camera access is not supported on this browser or requires a secure connection (HTTPS).",
        );
        setIsCameraStarting(false);
        return;
      }
      try{
        let stream:MediaStream;
        try{
          stream = await navigator.mediaDevices.getUserMedia({
            video:{
              facingMode:{ideal:facing},
              width:{ideal:1280},
              height:{ideal:720},
            },
          });
        }catch{
          stream = await navigator.mediaDevices.getUserMedia({video:true});
        }
        streamRef.current = stream;
        if(videoRef.current){
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute("playsinline","true");
          await videoRef.current.play();
          setIsCameraStarting(false);
          animFrameRef.current = requestAnimationFrame(scanFrame);
        }
      }catch(err:any){
        console.error("Camera stream error:",err);
        setIsCameraStarting(false);
        if(err.name === "NotAllowedError"||err.name === "PermissionDeniedError"){
          setCameraError(
            "Camera access was denied. Please allow camera permissions in your browser or phone settings.",
          );
        }else if(err.name === "NotFoundError"||err.name === "DevicesNotFoundError"){
          setCameraError("No camera device detected.");
        }else{
          setCameraError(
            `Camera error: ${err.message||"Unable to start camera"}`,
          );
        }
      }
    },
    [stopCamera,scanFrame],
  );
  const openScanner = ()=>{
    setScannerOpen(true);
    setCameraError(null);
    startCamera(cameraFacing);
  };
  const closeScanner = ()=>{
    stopCamera();
    setScannerOpen(false);
  };
  const flipCamera = ()=>{
    const nextFacing = cameraFacing === "environment"?"user":"environment";
    setCameraFacing(nextFacing);
    startCamera(nextFacing);
  };

  useEffect(()=>{
    return ()=>{
      stopCamera();
    };
  },[stopCamera]);
  
  return{
    scannerOpen,
    cameraFacing,
    cameraError,
    isCameraStarting,
    videoRef,
    openScanner,
    closeScanner,
    flipCamera,
    startCamera,
    
  };
}