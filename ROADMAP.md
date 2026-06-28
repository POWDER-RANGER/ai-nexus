# AI Nexus Development Roadmap

> **⚠️ PROTOTYPE — Features marked ✅ are implemented; 🚧 are in progress; ⬜ are on the roadmap.**

---

## Current Status: v0.1.0 PROTOTYPE

| Component | Status | Notes |
|-----------|--------|-------|
| **Landing Page** | ✅ Implemented | Static HTML/CSS page at `index.html` |
| **Backend API** | ✅ Implemented | Express.js + TypeScript with `/health`, `/api/query`, auth |
| **Database** | ✅ Implemented | SQLite with `queries` and `users` tables |
| **Frontend App** | ✅ Implemented | React 18 + Vite with auth, query form, history |
| **Docker Compose** | ✅ Implemented | Full local dev stack (backend + frontend) |
| **JWT Authentication** | ✅ Implemented | Register/login with bcrypt + JWT tokens |
| **Mock AI Responses** | ✅ Implemented | Placeholder responses pending local LLM |
| **Tests** | ✅ Implemented | Backend integration tests + frontend render tests |
| **Local LLM Inference** | ⬜ Roadmap | Planned: GGUF via llama.cpp WASM — v0.2.0 |
| **Image Generation** | ⬜ Roadmap | Planned: Stable Diffusion WebGPU — v0.3.0 |
| **Music Synthesis** | ⬜ Roadmap | Planned: Web Audio API — v0.3.0 |
| **Voice Cloning** | ⬜ Roadmap | Planned: Coqui TTS Web — v0.4.0 |
| **Multi-Modal Chat** | ⬜ Roadmap | Planned: Vision + Text — v0.4.0 |
| **Code Assistant** | ⬜ Roadmap | Planned: CodeLlama local — v0.4.0 |
| **WebGPU Acceleration** | ⬜ Roadmap | Planned: GPU compute shaders — v0.3.0 |

---

## Architecture

```
┌─────────────────────────────────────────────┐
│              AI NEXUS v0.1.0                 │
├─────────────────────────────────────────────┤
│  Frontend (React 18 + Vite)                 │
│  ├── AuthForm      (login / register)       │
│  ├── QueryForm     (prompt + model select)  │
│  └── QueryHistory  (auto-refresh list)      │
├─────────────────────────────────────────────┤
│  Backend (Express.js + TypeScript)          │
│  ├── POST /api/auth/register                │
│  ├── POST /api/auth/login                   │
│  ├── POST /api/query      (auth required)   │
│  ├── GET  /api/queries    (auth required)   │
│  └── GET  /api/health                       │
├─────────────────────────────────────────────┤
│  Database (SQLite)                          │
│  ├── users     (id, username, password_hash)│
│  └── queries   (id, prompt, response, ...)  │
└─────────────────────────────────────────────┘
```

---

## Getting Started

```bash
# Clone and start
git clone https://github.com/POWDER-RANGER/ai-nexus.git
cd ai-nexus

# Option 1: Docker Compose (recommended)
docker compose up --build

# Option 2: Manual
cd backend && npm install && npm run dev   # Terminal 1
cd frontend && npm install && npm run dev  # Terminal 2
```

---

## API Documentation

### Authentication
All query endpoints require a Bearer token:
```
Authorization: Bearer <jwt_token>
```

### Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/health` | No | Health check |
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Login |
| POST | `/api/query` | Yes | Submit AI query |
| GET | `/api/queries` | Yes | Query history |

---

## Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

---

*Last updated: 2026-06-28*
