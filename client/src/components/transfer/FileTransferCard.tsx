import React from "react";
import {UploadCloud, FileText} from "lucide-react";
import { formatBytes } from "../../utils/formatters";
import { TransferProgressBar } from "./TransferProgressBar";

interface FileTransferCardProps{
  fileInputRef:React.RefObject<HTMLInputElement|null>;
  stagedFile:File|null;
  isDragOver:boolean;
  isTransferring:boolean;
  activeChannel:RTCDataChannel|null;
  transferType:"upload"|"download"|"idle";
  activeProgress:number;
  activeFileName:string;
  transferredBytes:number;
  totalBytes:number;
  onFileInputChange:(event:React.ChangeEvent<HTMLInputElement>)=>void;
  onCancelTransfer:()=>void;
  onStartTransfer:()=>void;
}

export const FileTransferCard:React.FC<FileTransferCardProps>=({
  fileInputRef,
  stagedFile,
  isDragOver,
  isTransferring,
  activeChannel,
  transferType,
  activeProgress,
  activeFileName,
  transferredBytes,
  totalBytes,
  onFileInputChange,
  onCancelTransfer,
  onStartTransfer
})=>{
  return(
    <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-8 flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl md:text-5xl font-extrabold text-black tracking-tight leading-tight">
          Share files directly from your device to anywhere across the globe!
        </h1>
        <h3 className="text-lg md:text-xl font-extrabold text-red-700 tracking-tight leading-tight">
          Drag &amp; Drop Files
        </h3>

        <p className="text-black text-xs md:text-sm leading-relaxed max-w-lg">
          Photon can transfer up to 20GB of data! It uses direct peer-to-peer
          connection with zero intermediary storage.
        </p>

        <div className="w-full sm:w-auto flex items-center gap-3 pt-1">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={onFileInputChange}
          />
          <button
            className="disabled:bg-red-900 disabled:text-gray-200 w-full sm:w-auto inline-flex items-center justify-center gap-2.5 p-5 rounded-xl bg-black text-white font-extrabold text-sm transition hover:bg-red-700 active:scale-95 shadow-md"
            onClick={()=>fileInputRef.current?.click()}
            disabled={isTransferring}
          >
            <UploadCloud size={28}/>
            <span className="text-2xl">Browse Files</span>
          </button>
        </div>

        {stagedFile&&(
          <div
            className={`border rounded-xl p-3 md:p-3.5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between bg-[#181d2a] gap-3 transition ${
              isDragOver
                ?"border-orange-500 bg-[#251810]"
                :"border-slate-700/60"
            }`}
          >
            <div className="flex items-center gap-2.5 text-xs md:text-sm text-white font-semibold truncate max-w-full sm:max-w-xs">
              <FileText size={16} className="text-orange-500 shrink-0"/>
              <span className="truncate" title={stagedFile.name}>
                {stagedFile.name} ({formatBytes(stagedFile.size)})
              </span>
            </div>

            <button
              className="px-4 py-2 bg-red-700 hover:bg-orange-600 text-white font-bold text-xs rounded-full transition shrink-0 text-center shadow-sm"
              onClick={isTransferring?onCancelTransfer:onStartTransfer}
            >
              {isTransferring
                ?"Cancel"
                :activeChannel
                  ?"Share Now"
                  :"Connect & Share"}
            </button>
          </div>
        )}
      </div>

      <TransferProgressBar
        isTransferring={isTransferring}
        transferType={transferType}
        stagedFile={stagedFile}
        activeProgress={activeProgress}
        activeFileName={activeFileName}
        transferredBytes={transferredBytes}
        totalBytes={totalBytes}
      />
    </div>
  );
};