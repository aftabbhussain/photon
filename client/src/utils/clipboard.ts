export async function copyToClipboard(text:string):Promise<boolean>{
  try{
    if(navigator.clipboard&&window.isSecureContext){
      await navigator.clipboard.writeText(text);
      return true;
    }
    const textarea=document.createElement("textarea");
    textarea.value=text;
    textarea.style.position="fixed";
    textarea.style.left="-9999px";
      textarea.style.top="0";
    textarea.style.opacity="0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const copied=document.execCommand("copy");
    document.body.removeChild(textarea);
    return copied;
  }catch{
    return false;
  }
}