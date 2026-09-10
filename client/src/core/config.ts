export const signalingURL = 
  import.meta.env.VITE_SIGNALING_SERVER_URL || 'wss://photon-signaling-service.onrender.com';

export const CONFIG = {
    SIGNALING_URL : signalingURL,
    configuration : {
        iceServers : [
            {
                urls: "stun:stun.l.google.com:19302"
            }
        ]
    },
    STREAMING : {
        CHUNK_SIZE : 16*1024,
        BUFFER_HIGH : 1024*1024,
        BUFFER_LOW : 256*1024
    }
}