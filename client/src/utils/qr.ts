export function parseRoomCodeFromQr(raw:string):string|null{
  if(!raw)return null;
  const trimmed = raw.trim();
  try{
    const url = new URL(trimmed);
    const room = url.searchParams.get("room");
    if(room && room.length >= 4 && room.length <= 8){
      return room.toUpperCase();
    }
  }catch{
    const match = trimmed.match(/[?&]room=([A-Za-z0-9]{4,8})/i);
    if(match && match[1]){
      return match[1].toUpperCase();
    }
  }
  const clean = trimmed.replace(/[^A-Za-z0-9]/g,"").toUpperCase();
    if(clean.length >= 4 && clean.length <= 8){
    return clean;
  }
  return null;
}