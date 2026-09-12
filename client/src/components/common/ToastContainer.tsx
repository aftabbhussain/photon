import React from "react";
import {Check, AlertCircle, Clock} from "lucide-react";
import type { ToastItem } from "../../types/toastTypes";
interface ToastContainerProps{
  toasts: ToastItem[];
}

export const ToastContainer: React.FC<ToastContainerProps>=({toasts})=>{
  return(
    <div className="fixed bottom-4 right-3 left-3 sm:left-auto sm:right-6 flex flex-col gap-2.5 z-50 pointer-events-none max-w-sm">
      {toasts.map((item)=>(
        <div
          key={item.id}
          className="pointer-events-auto bg-[#161b26] border border-slate-700/60 px-4 py-3 rounded-xl text-white text-xs sm:text-sm font-semibold flex items-center gap-2.5 shadow-2xl"
        >
          {item.type==="success"?(
            <Check size={16} className="text-emerald-400 shrink-0"/>
          ):item.type==="error"?(
            <AlertCircle size={16} className="text-rose-500 shrink-0"/>
          ):(
            <Clock size={16} className="text-orange-400 shrink-0"/>
          )}
          <span>{item.text}</span>
        </div>
      ))}
    </div>
  );
};