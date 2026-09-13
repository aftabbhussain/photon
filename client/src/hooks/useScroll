import {useState,useEffect} from "react";

export function useScroll(threshold = 20):boolean{
  const [isScrolled,setIsScrolled] = useState(false);
  useEffect(()=>{
    const handleScroll = ()=>{
      setIsScrolled(window.scrollY > threshold);
    };
    handleScroll();
    window.addEventListener("scroll",handleScroll,{passive:true});
    return ()=>{
      window.removeEventListener("scroll",handleScroll);
    };
  },[threshold]);
  return isScrolled;
}