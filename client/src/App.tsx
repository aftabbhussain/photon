import React, { useEffect, useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { ENGINE_CONFIG } from './core/config.js';
import { SignalingService } from './services/signalingService.js';
import { WebRTCService } from './services/webrtcService.js';
import { FileSender } from './workers/fileSender.js';
import { FileReceiver } from './workers/fileReceiver.js';

function ArchitectureSandboxApp() {
  const [status, setStatus] = useState('Initializing Infrastructure Core...');
  const [roomCode, setRoomCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [activeChannel, setActiveChannel] = useState<RTCDataChannel | null>(null);
  const [progressTracker, setProgressTracker] = useState('Progress Metrics: Idle');
  const [stagedFile, setStagedFile] = useState<File | null>(null);

  // Use refs to hold persistent instances across renders without closure trapping
  const signalingRef = useRef<SignalingService | null>(null);
  const webrtcRef = useRef<WebRTCService | null>(null);
  const receiverRef = useRef<FileReceiver | null>(null);

  useEffect(() => {
    console.log('🏗️  Initializing Service Instances...');

    // 1. Initialize Binary File Receiver Worker
    receiverRef.current = new FileReceiver({
      onMetaReceived: (name, size) => {
        setStatus(`📥 Receiving file: "${name}" (${(size / (1024 * 1024)).toFixed(2)} MB)`);
      },
      onProgress: (received, total) => {
        setProgressTracker(`Download Progress: ${((received / total) * 100).toFixed(1)}%`);
      },
      onComplete: (_, name) => {
        setProgressTracker(`🏁 Download complete! "${name}" saved to disk.`);
        setStatus('P2P Pipeline Securely Idle');
      }
    });

    // 2. Initialize WebRTC Signaling Proxy Wrapper
    webrtcRef.current = new WebRTCService({
      onIceCandidate: (candidate) => {
        console.log('📡 Local ICE Candidate generated, relaying...');
        signalingRef.current?.send('ice-candidate', { candidate });
      },
      onConnectionStateChange: (state) => {
        setStatus(`WebRTC Connection State: ${state}`);
      },
      onDataChannelCaptured: (channel) => {
        console.log('🟢 P2P Data Channel captured successfully.');
        setActiveChannel(channel);
        channel.binaryType = 'arraybuffer';
        channel.onmessage = (event) => receiverRef.current?.handleIncomingMessage(event);
      }
    });

    // 3. Initialize Server Signaling Pipeline
    signalingRef.current = new SignalingService(ENGINE_CONFIG.SIGNALING_URL, {
      onOpen: () => {
        console.log('🔌 Signaling WebSocket Connected.');
        setStatus('🚀 Connected to signaling node. Ready to link.');
      },
      onClose: () => {
        setStatus('🔴 Signaling connection dropped.');
        setActiveChannel(null);
      },
      onError: (err) => {
        console.error('🚨 Signaling socket error:', err);
        setStatus('🚨 Signaling connection error.');
      },
      onMessage: async (packet) => {
        console.log(`📥 Inbound Signaling Message: [${packet.type}]`, packet.payload);
        
        switch (packet.type) {
          case 'room-created':
            console.log(`✨ Room successfully allocated: ${packet.payload.roomCode}`);
            setRoomCode(packet.payload.roomCode);
            setStatus(`Room ready. Share code [${packet.payload.roomCode}] to connect.`);
            break;

          case 'peer-joined':
            setStatus('Peer entered room. Initiating offer...');
            if (webrtcRef.current) {
              webrtcRef.current.initialize();
              webrtcRef.current.createLocalDataChannel('file-transfer');
              const offer = await webrtcRef.current.generateOffer();
              signalingRef.current?.send('offer', { sdp: offer });
            }
            break;

          case 'offer':
            setStatus('Inbound offer received. Generating answer...');
            if (webrtcRef.current) {
              webrtcRef.current.initialize();
              webrtcRef.current.setupRemoteDataChannelListener();
              const answer = await webrtcRef.current.generateAnswer(packet.payload.sdp);
              signalingRef.current?.send('answer', { sdp: answer });
            }
            break;

          case 'answer':
            setStatus('Remote answer matched. Finalizing connection...');
            await webrtcRef.current?.acceptAnswer(packet.payload.sdp);
            break;

          case 'ice-candidate':
            await webrtcRef.current?.injectIceCandidate(packet.payload.candidate);
            break;

          case 'peer-left':
            setStatus('Opponent disconnected. Pipeline reset.');
            setActiveChannel(null);
            webrtcRef.current?.terminate();
            break;

          case 'error':
            setStatus(`Backend Error: ${packet.payload?.message}`);
            break;
        }
      }
    });

    // Connect to the signaling server
    signalingRef.current.connect();

    // Teardown connections on unmount
    return () => {
      signalingRef.current?.disconnect();
      webrtcRef.current?.terminate();
    };
  }, []);

  const handleCreateRoom = () => {
    console.log('➔ Dispatching "create-room" request packet...');
    signalingRef.current?.send('create-room');
  };

  const handleJoinRoom = () => {
    const cleanCode = inputCode.trim().toUpperCase();
    if (!cleanCode) return;
    console.log(`➔ Dispatching "join-room" request packet for code: ${cleanCode}`);
    signalingRef.current?.send('join-room', { roomCode: cleanCode });
  };

  const handleFileTransferStream = async () => {
    if (!activeChannel || !stagedFile) return;

    const senderEngine = new FileSender(activeChannel, {
      onProgress: (sent, total) => {
        setProgressTracker(`Upload Progress: ${((sent / total) * 100).toFixed(1)}%`);
      },
      onComplete: () => {
        setProgressTracker(`🏁 Stream complete! "${stagedFile.name}" fully dispatched.`);
      },
      onError: (err) => {
        setStatus(`Streaming error: ${err}`);
      }
    });

    await senderEngine.streamFile(stagedFile);
  };

  return (
    <div style={{ padding: 32, fontFamily: 'monospace', background: '#0a0a0c', color: '#38bdf8', minHeight: '100vh' }}>
      <h2 style={{ color: '#f43f5e', borderBottom: '2px dashed #333', paddingBottom: 12 }}>🧪 Production Architecture Sandbox Verification Ground</h2>
      
      <div style={{ background: '#111827', border: '1px solid #1f2937', padding: 16, borderRadius: 6, marginBottom: 20 }}>
        <p><strong>System Core Engine Status:</strong> <span style={{ color: '#fff' }}>{status}</span></p>
        <p><strong>Active Sync Room Code:</strong> <span style={{ color: '#10b981', fontSize: '1.4rem', fontWeight: 'bold' }}>{roomCode || 'N/A'}</span></p>
        <p><strong>Data Channel Pipeline Status:</strong> {activeChannel ? '🟢 Securely Open & Ordered' : '🔴 Closed/Inert'}</p>
      </div>

      <div style={{ marginBottom: 24 }}>
        <button onClick={handleCreateRoom} style={{ background: '#2563eb', color: '#fff', border: 0, padding: '12px 20px', borderRadius: 4, cursor: 'pointer', marginRight: 12, fontWeight: 'bold' }}>
          1. Create Room (Host Mode)
        </button>

        <input 
          value={inputCode} 
          onChange={e => setInputCode(e.target.value)} 
          placeholder="ENTER 6-CHAR CODE" 
          style={{ padding: '12px', width: '180px', background: '#1e1e24', border: '1px solid #3f3f46', color: '#fff', marginRight: 12, borderRadius: 4, textTransform: 'uppercase', fontWeight: 'bold' }}
        />
        <button onClick={handleJoinRoom} style={{ background: '#059669', color: '#fff', border: 0, padding: '12px 20px', borderRadius: 4, cursor: 'pointer', fontWeight: 'bold' }}>
          2. Join Room (Receiver Mode)
        </button>
      </div>

      <div style={{ borderTop: '1px dashed #333', paddingTop: 20 }}>
        <h3>Stream Driver Core Engine</h3>
        <input type="file" onChange={e => setStagedFile(e.target.files?.[0] || null)} style={{ marginBottom: 16, display: 'block', color: '#fff' }} />
        
        <button onClick={handleFileTransferStream} disabled={!activeChannel || !stagedFile} style={{ background: activeChannel && stagedFile ? '#db2777' : '#374151', color: '#fff', border: 0, padding: '14px 28px', borderRadius: 4, cursor: activeChannel && stagedFile ? 'pointer' : 'not-allowed', fontSize: '1rem', fontWeight: 'bold' }}>
          🚀 Stream File End-To-End
        </button>
      </div>

      <div style={{ marginTop: 32, background: '#1e1b4b', padding: 16, borderRadius: 4, border: '1px solid #312e81' }}>
        <h4 style={{ margin: '0 0 8px 0', color: '#c084fc' }}>Real-Time Byte Metrics Interface</h4>
        <div style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 'bold' }}>{progressTracker}</div>
      </div>
    </div>
  );
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root container element missing.');
createRoot(rootElement).render(<ArchitectureSandboxApp />);