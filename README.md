# Remote Sensing Satellite Image Analysis Platform

AI-powered platform for analyzing satellite images with multi-label land cover classification, object detection, and AI chatbot explanations.

## Architecture

```
React Frontend → Node.js Backend (Express) → Python FastAPI AI Service
```

## Project Structure

```
satellite_detection/
├── frontend/          # React application
├── backend/           # Node.js Express API
├── ai-service/        # Python FastAPI (classification + YOLO)
├── models/            # Trained model weights
├── uploads/           # Uploaded images
└── datasets/          # Training datasets
```

## Quick Start

### 1. AI Service (Python)
```bash
cd ai-service
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
# Runs on http://localhost:8000
```

### 2. Backend (Node.js)
```bash
cd backend
npm install
# Set OPENAI_API_KEY in .env
npm run dev
# Runs on http://localhost:5000
```

### 3. Frontend (React)
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

## Environment Variables

**Backend (.env)**
- `OPENAI_API_KEY` - OpenAI API key for chatbot
- `AI_SERVICE_URL` - Python AI service URL (default: http://localhost:8000)

**Frontend**
- `REACT_APP_API_URL` - Backend API URL (empty = use proxy to localhost:5000 in dev)

## Features

- **Multi-Label Land Cover Classification** - ResNet50/EfficientNet with Sigmoid
- **Object Detection** - YOLOv8 for buildings, roads, vehicles, etc.
- **AI Chatbot** - Explains analysis results using OpenAI
- **Results Dashboard** - Charts, bounding boxes, detected objects list
