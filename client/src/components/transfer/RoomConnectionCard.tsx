import React from "react";
import { Camera, Check, Copy, QrCode } from "lucide-react";
import { QRCodeSVG} from "qrcode.react";
interface RoomConnectionCardProps{
  roomCode:string;
  inputCode:string;
  setInputCode:(code:string)=>void;
  activeChannel:RTCDataChannel|null;
  signalingConnected:boolean;
  webrtcState:string;
  shareUrl:string;
  copiedLink:boolean;
  copiedCode:boolean;
  handleCreateRoom:()=>void;
  handleJoinRoom:()=>void;
  handleDisconnect:()=>void;
  openScanner:()=>void;
  copyShareLink:()=>void;
  copyRoomCode:()=>void;
  setQrModalOpen:(open:boolean)=>void;
}
export const RoomConnectionCard:React.FC<RoomConnectionCardProps>=({
  roomCode,
  inputCode,
  setInputCode,
  activeChannel,
  signalingConnected,
  webrtcState,
  shareUrl,
  copiedLink,
  copiedCode,
  handleCreateRoom,
  handleJoinRoom,
  handleDisconnect,
  openScanner,
  copyShareLink,
  copyRoomCode,
  setQrModalOpen,
})=>{
  return(
    <div className="w-full bg-black border border-[#222938] rounded-2xl md:rounded-3xl p-4 md:p-6 self-start flex flex-col gap-3 lg:mt-0 lg:sticky lg:top-[calc(50vh-225px)]">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-black border border-[#222938] rounded-xl p-4 md:p-5 flex flex-col gap-4">
          <span className="text-[11px] font-bold text-white uppercase tracking-wider">
            Sender Side
          </span>

          <button
            className="w-full py-3 rounded-full bg-white hover:bg-red-700 hover:text-white text-black text-sm md:text-lg font-bold flex items-center justify-center transition shadow-sm"
            onClick={handleCreateRoom}
          >
            {roomCode?"New Room":"Create Room"}
          </button>
        </div>

        <div className="bg-black border border-[#222938] rounded-xl p-4 md:p-5 flex flex-col gap-4">
          <span className="text-[11px] font-bold text-white uppercase tracking-wider">
            Receiver Side
          </span>

          <div className="flex items-center gap-2">
            <input
              className="flex-1 min-w-0 px-3 py-2.5 bg-black border border-[#222938] rounded-full text-white text-xs sm:text-sm font-extrabold tracking-[2px] uppercase text-center focus:border-blue-500 outline-none transition"
              placeholder="ENTER CODE"
              maxLength={6}
              value={inputCode}
              onChange={(e)=>setInputCode(e.target.value.toUpperCase())}
            />

            <button
              className="w-10 h-10 rounded-full bg-[#252e42] border border-[#3b4760] text-white hover:bg-[#313d56] flex items-center justify-center shrink-0 transition"
              onClick={openScanner}
              title="Scan Room QR Code with Camera"
            >
              <Camera size={16}/>
            </button>

            <button
              className="px-4 py-2.5 rounded-full bg-red-700 hover:bg-red-600 text-white text-xs sm:text-sm font-bold shrink-0 transition shadow-sm"
              onClick={handleJoinRoom}
            >
              Join
            </button>
          </div>
        </div>
      </div>

      <div className="bg-black border border-[#222938] rounded-xl md:rounded-2xl p-3.5 md:p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center sm:items-start gap-2.5 flex-1">
            <span className="text-[11px] font-bold text-white uppercase tracking-wider">
              Active Room Code :
            </span>

            <div className="flex items-center justify-center gap-1.5 flex-wrap">
              {!roomCode&&(
                <>
                  <div className="w-8 h-10 rounded-lg bg-[#11151f] flex items-center justify-center text-base sm:text-lg font-extrabold text-white shadow-inner"></div>
                  <div className="w-8 h-10 rounded-lg bg-[#11151f] flex items-center justify-center text-base sm:text-lg font-extrabold text-white shadow-inner"></div>
                  <div className="w-8 h-10 rounded-lg bg-[#11151f] flex items-center justify-center text-base sm:text-lg font-extrabold text-white shadow-inner"></div>
                  <div className="w-8 h-10 rounded-lg bg-[#11151f] flex items-center justify-center text-base sm:text-lg font-extrabold text-white shadow-inner"></div>
                  <div className="w-8 h-10 rounded-lg bg-[#11151f] flex items-center justify-center text-base sm:text-lg font-extrabold text-white shadow-inner"></div>
                  <div className="w-8 h-10 rounded-lg bg-[#11151f] flex items-center justify-center text-base sm:text-lg font-extrabold text-white shadow-inner"></div>
                </>
              )}

              {roomCode.split("").map((char,idx)=>(
                <div
                  key={idx}
                  className="w-8 h-10 rounded-lg bg-[#11151f] flex items-center justify-center text-base sm:text-lg font-extrabold text-white shadow-inner"
                >
                  {char}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#252e42] border border-[#3b4760] text-white hover:bg-[#313d56] text-xs font-bold transition"
                onClick={copyShareLink}
              >
                {copiedLink?<Check size={12}/>:<Copy size={12}/>}
                <span>{copiedLink?"Copied":"Copy Link"}</span>
              </button>

              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#252e42] border border-[#3b4760] text-white hover:bg-[#313d56] text-xs font-bold transition"
                onClick={copyRoomCode}
              >
                {copiedCode?<Check size={12}/>:<Copy size={12}/>}
                <span>{copiedCode?"Copied":"Copy Code"}</span>
              </button>

              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#252e42] border border-[#3b4760] text-white hover:bg-[#313d56] text-xs font-bold transition"
                onClick={()=>setQrModalOpen(true)}
                title="Expand QR"
              >
                <QrCode size={12}/>
                <span>Zoom QR</span>
              </button>
            </div>
          </div>

          <div
            className="flex items-center justify-center bg-white p-2 rounded-xl shadow-lg shrink-0 cursor-pointer transition hover:opacity-95"
            onClick={()=>setQrModalOpen(true)}
            title="Click to enlarge QR"
          >
            <QRCodeSVG
              value={shareUrl}
              size={78}
              level="M"
              bgColor="#ffffff"
              fgColor="#0a0c10"
            />
          </div>
        </div>
      </div>

      <div className="min-h-[44px] flex items-center justify-between px-3.5 py-2 bg-[#161a24] border border-[#222938] rounded-xl text-xs">
        {roomCode||activeChannel?(
          <>
            <span className="text-xs text-slate-300 font-semibold truncate">
              Session #{roomCode||inputCode} active
            </span>

            <button
              className="px-3.5 py-1.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold flex items-center gap-1.5 transition shrink-0"
              onClick={handleDisconnect}
            >
              <span>Disconnect</span>
            </button>
          </>
        ):(
          <>
            <span className="text-[12px] text-slate-400 flex items-center gap-1.5 truncate">
              <span>Direct peer-to-peer connection</span>
            </span>

            <span className="text-[11px] text-white font-medium shrink-0">
              Standby
            </span>
          </>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-[#222938] pt-3">
        <div className="flex flex-col items-center text-center gap-0.5">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">
            Signaling Server
          </span>

          <span
            className={`text-xs font-bold ${signalingConnected?"text-emerald-400":"text-slate-400"}`}
          >
            {signalingConnected?"Online":"Offline"}
          </span>
        </div>

        <div className="flex flex-col items-center gap-0.5">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">
            WebRTC Connection
          </span>

          <span
            className={`text-xs font-bold ${activeChannel?"text-emerald-400":"text-slate-400"}`}
          >
            {webrtcState}
          </span>
        </div>

        <div className="flex flex-col gap-0.5 items-center">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">
            Data Channel
          </span>

          <span
            className={`text-xs font-bold ${activeChannel?"text-sky-400":"text-slate-400"}`}
          >
            {activeChannel?"Open":"Closed"}
          </span>
        </div>

        <div className="flex flex-col gap-0.5 items-center">
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">
            Throughput
          </span>

          <span className="text-xs font-bold text-sky-400">
            Line-Rate
          </span>
        </div>
      </div>
    </div>
  );
};