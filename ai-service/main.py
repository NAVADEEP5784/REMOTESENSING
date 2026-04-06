"""FastAPI AI Service for satellite image analysis."""

import base64
from contextlib import asynccontextmanager

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from services.classifier import LandCoverClassifier
from services.detector import ObjectDetector

classifier = None
detector = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global classifier, detector
    classifier = LandCoverClassifier()
    detector = ObjectDetector()
    yield
    classifier = None
    detector = None


app = FastAPI(title="Satellite Image AI Service", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    """Run classification and object detection on uploaded image."""
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(400, "File must be an image")

    content = await file.read()
    if len(content) == 0:
        raise HTTPException(400, "Empty file")

    classification = classifier.predict(content)
    annotated_bytes, detections = detector.detect(content)

    return {
        "classification": classification,
        "detections": detections,
        "annotated_image_base64": base64.b64encode(annotated_bytes).decode(),
    }
