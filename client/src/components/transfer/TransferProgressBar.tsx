import React from "react";
import { Activity } from "lucide-react";
import { formatBytes } from "../../utils/formatters";
interface TransferProgressBarProps{
  isTransferring:boolean;
  transferType:"upload"|"download"|"idle";
  stagedFile:File|null;
  activeProgress:number;
  activeFileName:string;
  transferredBytes:number;
  totalBytes:number;
}
export const TransferProgressBar:React.FC<TransferProgressBarProps>=({
  isTransferring,
  transferType,
  stagedFile,
  activeProgress,
  activeFileName,
  transferredBytes,
  totalBytes,
})=>{
  return(
    <div className="bg-black border border-[#222938] rounded-xl md:rounded-2xl p-4 md:p-5 flex flex-col gap-3.5">
      <div className="flex items-center justify-between">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wide ${isTransferring?"bg-[#222938] text-white":"bg-[#222938] text-white"}`}>
          <span>
            {isTransferring
              ? transferType==="upload"
                ? "Uploading to Peer..."
                : "Downloading from Peer..."
              : stagedFile
                ? "File Staged • Ready"
                : "Channel Idle"}
          </span>
        </div>

        <div className="flex items-baseline gap-0.5">
          <span className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            {activeProgress}
          </span>
          <span className="text-sm md:text-base font-bold text-slate-400">
            %
          </span>
        </div>
      </div>

      <div className="w-full h-2.5 bg-[#11151f] rounded-full overflow-hidden border border-[#222938]">
        <div
          className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
          style={{
            width:`${Math.max(activeProgress,stagedFile?5:0)}%`,
          }}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 gap-2">
        <div
          className="flex items-center gap-1.5 truncate max-w-[200px] md:max-w-xs text-slate-300 font-medium"
          title={activeFileName||"No file in transit"}
        >
          <Activity
            size={14}
            className={isTransferring?"text-orange-500":"text-slate-500"}
          />
          <span className="truncate">
            {activeFileName
              ? activeFileName
              : stagedFile
                ? stagedFile.name
                : "Select or drop a file to transfer"}
          </span>
        </div>

        <div className="font-semibold text-slate-300 shrink-0">
          {totalBytes>0
            ? `${formatBytes(transferredBytes)} / ${formatBytes(totalBytes)}`
            : stagedFile
              ? formatBytes(stagedFile.size)
              : "Ready"}
        </div>
      </div>
    </div>
  );
};