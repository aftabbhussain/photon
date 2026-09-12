import React from "react";
import { X, AlertCircle, RefreshCw } from "lucide-react";

interface CameraScannerModalProps{
  isOpen:boolean;
  onClose:()=>void;
  videoRef:React.RefObject<HTMLVideoElement|null>;
  cameraFacing:"environment"|"user";
  cameraError:string|null;
  isCameraStarting:boolean;
  onFlipCamera:()=>void;
  onRetryCamera:()=>void;
}

export const CameraScannerModal:React.FC<CameraScannerModalProps>=({
  isOpen,
  onClose,
  videoRef,
  cameraFacing,
  cameraError,
  isCameraStarting,
  onFlipCamera,
  onRetryCamera,
})=>{
  if(!isOpen)return null;

  return(
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="bg-[#141824] border border-slate-700/60 rounded-2xl md:rounded-3xl w-full max-w-[420px] p-5 md:p-6 relative text-center shadow-2xl"
        onClick={(e)=>e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#1e2434] border border-[#222938] flex items-center justify-center text-slate-400 hover:bg-[#2b3348] hover:text-white transition"
          onClick={onClose}
          title="Close Scanner"
        >
          <X size={16}/>
        </button>

        <h3 className="text-lg md:text-xl font-extrabold text-white mb-1 tracking-tight">
          Scan Room QR Code
        </h3>
        <p className="text-xs md:text-sm text-slate-400 mb-4 leading-relaxed">
          Point your camera at the host's screen to connect instantly.
        </p>

        <div className="w-full h-[240px] sm:h-[280px] bg-black rounded-xl md:rounded-2xl relative overflow-hidden flex items-center justify-center mb-4 border-2 border-slate-700">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            autoPlay
            muted
          />

          {!cameraError&&(
            <div className="absolute w-[170px] h-[170px] sm:w-[200px] sm:h-[200px] border-2 border-dashed border-sky-400 rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] pointer-events-none">
              <div className="absolute w-full h-[2px] bg-orange-500 shadow-[0_0_8px_#f97316] animate-scan-laser"/>
            </div>
          )}

          {isCameraStarting&&(
            <div className="absolute text-white text-xs sm:text-sm bg-black/75 px-4 py-2.5 rounded-xl font-semibold">
              Starting camera stream...
            </div>
          )}

          {cameraError&&(
            <div className="absolute inset-3 flex flex-col items-center justify-center bg-slate-900/95 p-4 rounded-xl text-rose-400 gap-2.5">
              <AlertCircle size={26}/>
              <span className="text-xs sm:text-sm leading-relaxed text-rose-300">
                {cameraError}
              </span>
              <button
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#252e42] border border-[#3b4760] text-sky-400 hover:bg-[#313d56] hover:text-white text-xs font-bold transition mt-2"
                onClick={onRetryCamera}
              >
                Retry Camera
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3">
          <button
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#252e42] border border-[#3b4760] text-sky-400 hover:bg-[#313d56] hover:text-white text-xs font-bold transition"
            onClick={onFlipCamera}
            title="Switch between rear and front camera"
          >
            <RefreshCw size={13}/>
            <span>
              Flip ({cameraFacing==="environment"?"Rear":"Front"})
            </span>
          </button>

          <button
            className="inline-flex items-center px-4 py-2 rounded-full bg-[#1e2434] border border-[#222938] text-slate-300 hover:bg-[#2b3348] hover:text-white text-xs font-bold transition"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};