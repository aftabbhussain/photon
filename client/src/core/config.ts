const signalingURL = import.meta.env.SIGNALING_SERVER || "ws://localhost:8080";

export const CONFIG = {
    SIGNALING_SERVER_URL : signalingURL,
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