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

  
  return{
    scannerOpen,
    cameraFacing,
    cameraError,
    isCameraStarting,
    videoRef,
    
  };
}