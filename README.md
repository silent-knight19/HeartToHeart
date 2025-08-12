# HeartToHeart

> **A private, secure, and intimate video conferencing web app designed for couples.**

HeartToHeart uses **WebRTC** for real-time peer-to-peer video and audio streaming, ensuring low-latency communication, with optional end-to-end encryption for maximum privacy. Built for simplicity, trust, and personal connection.

---

## Table of Contents

1. [Overview](#overview)
2. [Key Features](#key-features)
3. [Tech Stack](#tech-stack)
4. [Repository Structure](#repository-structure)
5. [Getting Started](#getting-started)

   * [Prerequisites](#prerequisites)
   * [Installation](#installation)
   * [Running the Application](#running-the-application)
6. [Environment Variables](#environment-variables)
7. [Architecture](#architecture)
8. [Security & Privacy Considerations](#security--privacy-considerations)
9. [Deployment](#deployment)
10. [Future Enhancements](#future-enhancements)
11. [Contributing](#contributing)
12. [License](#license)

---

## Overview

HeartToHeart is a browser-based video conferencing platform crafted specifically for couples who want a private space to connect. It blends **ease-of-use**, **security**, and **intimacy-focused design** into one app.

---

## Key Features

* **One-to-One Video Calls** — Optimized for personal conversations.
* **WebRTC Media Streaming** — Peer-to-peer connection for low latency.
* **Secure Authentication** — JWT-based authentication (configurable for unique couple logins).
* **Room Invite Links** — Simple link sharing for initiating calls.
* **Optional End-to-End Encryption** — For maximum privacy.
* **Text Chat** — Lightweight in-call messaging.
* **Theming Options** — Romantic and personalized color schemes.

---

## Tech Stack

**Frontend:**

* React.js (or similar SPA framework)
* WebRTC API
* CSS/Tailwind for styling

**Backend:**

* Node.js + Express.js
* Socket.IO (signaling server)
* JSON Web Tokens (JWT) for authentication
* MongoDB (or another database for user/room storage)

**Other:**

* STUN/TURN servers for NAT traversal
* dotenv for environment variables

---

## Repository Structure

```
HeartToHeart/
├── backend/         # Node.js server, authentication, signaling
├── frontend/        # React-based UI and WebRTC client logic
└── README.md
```

---

## Getting Started

### Prerequisites

* Node.js >= 16
* npm or yarn
* MongoDB instance
* STUN/TURN server (public STUN for development is fine)

### Installation

```bash
git clone https://github.com/silent-knight19/HeartToHeart.git
cd HeartToHeart

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Running the Application

In two separate terminals:

```bash
# Backend
cd backend
npm run dev

# Frontend
cd ../frontend
npm start
```

Default URLs:

* Frontend: `http://localhost:3000`
* Backend: `http://localhost:5000`

---

## Environment Variables

**Backend `.env`**

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/hearttoheart
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
STUN_SERVER=stun:stun.l.google.com:19302
TURN_SERVER=turn:your.turn.server:3478
TURN_USERNAME=your_turn_username
TURN_PASSWORD=your_turn_password
```

**Frontend `.env`**

```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_STUN_SERVER=stun:stun.l.google.com:19302
REACT_APP_TURN_SERVER=turn:your.turn.server:3478
```

---

## Architecture

```
[User A Browser] ⇄ [Frontend SPA] ⇄ [Backend (Signaling + Auth)] ⇄ [User B Browser]
                    ↘─────── WebRTC P2P Video/Audio ───────↙
```

* **Authentication:** JWT issued by backend.
* **Signaling:** Socket.IO handles SDP & ICE candidate exchange.
* **Media:** WebRTC establishes direct connection.

---

## Security & Privacy Considerations

* Use HTTPS in production to secure WebRTC.
* Store JWT secrets securely.
* Use private TURN servers for reliable connectivity.
* Consider E2E encryption for video/audio.

---

## Deployment

* **Frontend:** Netlify, Vercel, or serve from backend.
* **Backend:** Render, Heroku, AWS, or DigitalOcean.
* **Database:** MongoDB Atlas.
* **TURN/STUN:** Use a production-ready TURN service for reliability.

---

## Future Enhancements

* Add **voice-only mode** for low bandwidth.
* Implement **custom backgrounds**.
* Add **shared activity mode** (watch videos together, play games).
* Enhance **theming options**.

---

## Contributing

1. Fork this repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Commit your changes.
4. Push to your branch.
5. Open a Pull Request.

---

## License

This project currently has no license file — consider adding one (MIT recommended).

---

Maintained by [silent-knight19](https://github.com/silent-knight19)
