export const signalingURL = 
  import.meta.env.VITE_SIGNALING_SERVER_URL || 'wss://photon-signaling-service.onrender.com';

export const CONFIG = {
    SIGNALING_URL: signalingURL,
    configuration: {
        iceServers: [
            {
                urls: "stun:stun.l.google.com:19302"
            },
            {
                urls: "turn:global.relay.metered.ca:80",
                username: "be5a3187d47854e91abffc47",
                credential: "OytWihuNhZtWN+nC",
            },
            {
                urls: "turn:global.relay.metered.ca:80?transport=tcp",
                username: "be5a3187d47854e91abffc47",
                credential: "OytWihuNhZtWN+nC",
            },
            {
                urls: "turn:global.relay.metered.ca:443",
                username: "be5a3187d47854e91abffc47",
                credential: "OytWihuNhZtWN+nC",
            },
            {
                urls: "turns:global.relay.metered.ca:443?transport=tcp",
                username: "be5a3187d47854e91abffc47",
                credential: "OytWihuNhZtWN+nC",
            }
        ]
    },
    STREAMING: {
        CHUNK_SIZE: 16 * 1024,
        BUFFER_HIGH: 1024 * 1024,
        BUFFER_LOW: 256 * 1024
    }
};