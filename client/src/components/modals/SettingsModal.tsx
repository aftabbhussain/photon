import React from "react";
import { X } from "lucide-react";

interface SettingsModalProps{
  isOpen:boolean;
  onClose:()=>void;
  signalingUrl:string;
  signalingConnected:boolean;
  webrtcState:string;
  activeChannel:RTCDataChannel|null;
  status:string;
}

export const SettingsModal:React.FC<SettingsModalProps>=({
  isOpen,
  onClose,
  signalingUrl,
  signalingConnected,
  webrtcState,
  activeChannel,
  status,
})=>{
  if(!isOpen)return null;

  return(
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-700/60 rounded-2xl md:rounded-3xl w-auto max-w-[460px]c p-6 relative shadow-2xl"
        onClick={(e)=>e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#1e2434] border border-[#222938] flex items-center justify-center text-slate-400 hover:bg-[#2b3348] hover:text-white transition"
          onClick={onClose}
        >
          <X size={16}/>
        </button>

        <h3 className="text-lg md:text-xl font-extrabold text-black mb-1 tracking-tight">
          Connection Health
        </h3>
        <p className="text-xs md:text-sm text-black mb-5 leading-relaxed">
          Signaling Server &amp; Data Channel Health
        </p>

        <div className="bg-black w-auto p-4 rounded-xl mb-5 text-xs sm:text-sm flex flex-col gap-2.5 border border-[#222938]">
          <div className="flex justify-between">
            <span className="text-slate-400">Signaling Server:</span>
            <span className="text-sky-400 font-semibold">
              {signalingUrl}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">Signaling Server Status:</span>
            <span
              className={`font-semibold ${signalingConnected?"text-emerald-400":"text-rose-400"}`}
            >
              {signalingConnected?"Online":"Offline"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">WebRTC State:</span>
            <span
              className={`font-semibold ${activeChannel?"text-emerald-400":"text-rose-400"}`}
            >
              {webrtcState}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">Data Channel:</span>
            <span
              className={`font-semibold ${activeChannel?"text-emerald-400":"text-slate-400"}`}
            >
              {activeChannel?"Open & Ready":"Inert"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">Chunk Size:</span>
            <span className="text-white font-semibold">16 KB</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">Engine Status:</span>
            <span className="text-slate-300 font-semibold truncate max-w-xs">
              {status}
            </span>
          </div>
        </div>

        <button
          className="w-full py-2.5 rounded-full bg-black border border-[#222938] text-white hover:bg-[#2a3348] text-xs sm:text-sm font-bold transition"
          onClick={onClose}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};