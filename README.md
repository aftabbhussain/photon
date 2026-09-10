# Photon

Photon is a browser-based peer-to-peer file sharing application built
with WebRTC. Files are transferred directly between browsers using
WebRTC DataChannels, while a Node.js WebSocket server handles signaling
and room management.

## Features

-   Peer-to-peer file transfer using WebRTC DataChannels
-   WebSocket signaling using `ws`
-   Room creation and joining
-   WebRTC offer/answer negotiation
-   ICE candidate exchange
-   Chunked file transfer
-   Transfer progress tracking
-   DataChannel backpressure handling

## Tech Stack

-   React
-   TypeScript
-   Vite
-   Node.js
-   WebSocket (`ws`)
-   WebRTC

## Project Structure

``` text
photon/
├── client/
│   ├── src/
│   │   ├── core/
│   │   ├── services/
│   │   ├── types/
│   │   ├── workers/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env
│   ├── .gitignore
│   ├── .oxlintrc.json
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── vercel.json
│   └── vite.config.ts
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── handlers/
│   │   ├── managers/
│   │   ├── types/
│   │   ├── roomManager.ts
│   │   └── server.ts
│   ├── .env
│   ├── .gitignore
│   ├── dist/
│   ├── node_modules/
│   ├── package.json
│   ├── package-lock.json
│   ├── Readme.md
│   └── tsconfig.json
│
└── .gitignore
```

## Architecture

The application consists of a React client and a Node.js WebSocket
signaling server.

``` text
Browser A
    │
    │ WebSocket
    ▼
Signaling Server
    │
    │ WebSocket
    ▼
Browser B

Browser A ◄──── WebRTC DataChannel ────► Browser B
                         │
                    File Transfer
```

The WebSocket server is responsible for signaling between peers. The
actual file data is transferred through the WebRTC DataChannel.

## Connection Flow

1.  A user creates a room.
2.  The server generates a room code.
3.  Another user joins the room using the room code.
4.  The peers exchange WebRTC offer and answer messages through the
    signaling server.
5.  ICE candidates are exchanged through the signaling server.
6.  WebRTC establishes the peer-to-peer connection.
7.  The DataChannel becomes available.
8.  The selected file is transferred in chunks between the browsers.

## File Transfer

Files are divided into smaller chunks before being sent through the
WebRTC DataChannel.

The transfer follows this structure:

``` text
File Metadata
      ↓
Binary Chunks
      ↓
End of File
```

The sender also uses DataChannel backpressure to avoid continuously
filling the browser's outgoing buffer.

## Getting Started

### Prerequisites

-   Node.js
-   npm
-   A modern browser with WebRTC support

### Clone the Repository

``` bash
git clone https://github.com/<your-username>/photon.git
cd photon
```

### Install Dependencies

Install client dependencies:

``` bash
cd client
npm install
```

Install server dependencies:

``` bash
cd ../server
npm install
```

## Environment Variables

### Client

Create `client/.env`:

``` env
VITE_WS_SIGNALING_URL=ws://localhost:8080
```

### Server

Create `server/.env`:

``` env
PORT=8080
```

Do not commit `.env` files to the repository.

## Running Locally

Start the signaling server:

``` bash
cd server
npm run dev
```

Start the client in a separate terminal:

``` bash
cd client
npm run dev
```

Open the application in two browser windows.

Create a room in one browser, join the room from the other browser, and
transfer a file between the peers.

## Production

The client and signaling server can be deployed separately.

For the production client, configure the WebSocket server URL using:

``` env
VITE_WS_SIGNALING_URL=wss://your-signaling-server.example.com
```

Use `wss://` for secure production WebSocket connections.

## Current WebRTC Configuration

The current implementation uses a STUN server for WebRTC connectivity.
TURN support is not currently configured.

Without TURN, some peer connections may fail when users are behind
restrictive NATs or firewalls.

## License

This project is currently developed for learning and experimentation
with WebRTC, WebSocket signaling, and peer-to-peer file transfer.
