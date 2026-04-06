# Satellite Image Analysis Platform — Documentation

**Version:** 1.0  
**Last Updated:** March 2025

---

## Table of Contents

1. [Overview](#1-overview)
2. [Architecture](#2-architecture)
3. [Setup & Installation](#3-setup--installation)
4. [Features](#4-features)
5. [API Reference](#5-api-reference)
6. [Configuration](#6-configuration)
7. [Project Structure](#7-project-structure)

---

## 1. Overview

The **Satellite Intelligence Platform** is an AI-powered web application for analyzing satellite and aerial images. It performs:

- **Land Cover Classification** — 10 EuroSAT classes using ResNet18
- **Object Detection** — YOLOv8 for identifying objects in imagery
- **AI Chatbot** — OpenAI GPT for explaining results
- **Admin Dashboard** — Login, stats, upload management

---

## 2. Architecture

| Layer | Technology | Port |
|-------|------------|------|
| Frontend | React (Vite), Recharts, Framer Motion | 5173 (dev) |
| Backend | Node.js, Express | 5000 |
| AI Service | Python FastAPI, PyTorch, YOLOv8 | 8000 |

**Flow:** Frontend → Backend (proxy) → AI Service → Response

---

## 3. Setup & Installation

### Prerequisites

- Node.js 18+
- Python 3.10+
- OpenAI API key (for chatbot)

### Backend

```bash
cd backend
npm install
# Set variables in .env
npm run dev
```

### AI Service

```bash
cd ai-service
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm start
```

### Order

1. Start AI service (port 8000)  
2. Start backend (port 5000)  
3. Start frontend (port 5173)

---

## 4. Features

### 4.1 Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Landing, pipeline overview, sample data |
| Analyze | `/upload` | Single & batch image upload |
| Results | `/results` | Classification, detections, insights |
| History | `/history` | Past analyses (localStorage) |
| Dashboard | `/dashboard` | Analytics charts |
| Chatbot | `/chat` | AI Q&A about analysis |
| Settings | `/settings` | Theme (dark/light) |
| Help | `/help` | FAQ, getting started |
| Login | `/login` | Admin authentication |
| Admin | `/admin` | Protected stats & uploads |

### 4.2 Admin Login

- **URL:** `/login`
- **Default:** `admin@satellite.local` / `admin123`
- Configure via `ADMIN_EMAIL`, `ADMIN_PASSWORD` in `backend/.env`

### 4.3 Export

- **JSON** — Full analysis data  
- **CSV** — Classification + detections  
- **PDF** — Report with tables  
- **Download** — Annotated detection image (PNG)

### 4.4 Other Features

- **Theme Toggle** — Dark/Light, persisted
- **Toast Notifications** — Success, error, info
- **Share** — Copy results link
- **Batch Upload** — Multiple images, sequential processing

---

## 5. API Reference

### Backend (`http://localhost:5000`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analyze` | Upload image, returns classification + detections |
| POST | `/api/chat` | Chat about analysis (OpenAI) |
| GET | `/api/health` | Health check |
| POST | `/api/auth/login` | Admin login |
| POST | `/api/auth/verify` | Verify JWT |
| GET | `/api/admin/stats` | Upload stats (auth required) |
| GET | `/api/admin/uploads` | List uploads (auth required) |

### AI Service (`http://localhost:8000`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/analyze` | Analyze image (multipart) |
| GET | `/health` | Health check |

---

## 6. Configuration

### Backend `.env`

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| AI_SERVICE_URL | AI service URL | http://127.0.0.1:8000 |
| OPENAI_API_KEY | OpenAI key for chatbot | — |
| ADMIN_EMAIL | Admin login email | admin@satellite.local |
| ADMIN_PASSWORD | Admin password | admin123 |
| JWT_SECRET | JWT signing secret | (see .env) |

---

## 7. Project Structure

```
satellite_detection/
├── frontend/          # React app
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── utils/
│   └── package.json
├── backend/           # Express API
│   ├── routes/
│   ├── middleware/
│   └── server.js
├── ai-service/        # Python FastAPI
│   ├── services/
│   └── main.py
├── datasets/          # EuroSAT images
└── docs/              # Documentation
```

---

*End of Documentation*
