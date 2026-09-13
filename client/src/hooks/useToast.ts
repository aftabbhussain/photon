import {useState,useCallback} from "react";
import type {ToastItem} from "../types/toastTypes";

export function useToast(){
  const [toasts,setToasts] = useState<ToastItem[]>([]);
  const showToast = useCallback(
    (text:string,type:"info"|"success"|"error" = "info")=>{
      const id = Math.random().toString(36).substring(2,9);
      setToasts(prev=>[...prev,{id,text,type}]);
      setTimeout(()=>{
        setToasts(prev=>prev.filter(t=>t.id !== id));
      },4000);
    },
    [],
  );
  return {toasts,showToast};
}