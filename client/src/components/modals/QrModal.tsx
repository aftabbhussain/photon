import React from "react";
import { X, Check, Copy } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface QrModalProps{
  isOpen:boolean;
  roomCode:string;
  shareUrl:string;
  copiedLink:boolean;
  onClose:()=>void;
  onCopyShareLink:()=>void;
}

export const QrModal:React.FC<QrModalProps>=({
  isOpen,
  roomCode,
  shareUrl,
  copiedLink,
  onClose,
  onCopyShareLink,
})=>{
  if(!isOpen||!roomCode)return null;

  return(
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-700/60 rounded-2xl md:rounded-3xl w-full max-w-[380px] p-6 relative text-center shadow-2xl"
        onClick={(e)=>e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#1e2434] border border-[#222938] flex items-center justify-center text-slate-400 hover:bg-[#2b3348] hover:text-white transition"
          onClick={onClose}
        >
          <X size={16}/>
        </button>

        <h3 className="text-lg md:text-xl font-extrabold text-black mb-1 tracking-tight">
          Scan to Join Room
        </h3>
        <p className="text-xs md:text-sm text-black mb-5 leading-relaxed">
          Open your phone's camera to join Room #{roomCode} instantly.
        </p>

        <div className="bg-white p-4 rounded-2xl inline-block mx-auto mb-5 shadow-md">
          <QRCodeSVG
            value={shareUrl}
            size={220}
            level="H"
            bgColor="#ffffff"
            fgColor="#0a0c10"
          />
        </div>

        <button
          className="w-full py-3 rounded-full bg-black hover:bg-red-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-md"
          onClick={onCopyShareLink}
        >
          {copiedLink?<Check size={16}/>:<Copy size={16}/>}
          <span>{copiedLink?"Link Copied!":"Copy Direct Link"}</span>
        </button>
      </div>
    </div>
  );
};