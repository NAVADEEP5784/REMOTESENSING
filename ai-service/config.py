"""Configuration for the AI Service."""

# Multi-label land cover classes
LAND_COVER_CLASSES = [
    "Forest",
    "Residential",
    "Agricultural Land",
    "River / Water Body",
    "Industrial Area",
    "Highway",
    "Barren Land",
]

# Object detection classes (YOLOv8 COCO + custom - common in satellite imagery)
DETECTION_CLASSES = [
    "Buildings",
    "Roads",
    "Hospitals",
    "Sports fields",
    "Crop fields",
    "Vehicles",
    "Other structures",
]

# Image preprocessing
IMAGE_SIZE = 224
MEAN = [0.485, 0.456, 0.406]
STD = [0.229, 0.224, 0.225]

# Model paths
MODELS_DIR = "models"
CLASSIFICATION_WEIGHTS = "models/classification_model.pth"
EUROSAT_WEIGHTS = "models/eurosat_model.pth"  # EuroSAT 10-class model (train with train_eurosat.py)
YOLO_MODEL = "yolov8n.pt"  # Nano model for speed; use yolov8m.pt for better accuracy

# EuroSAT classes (10-class single-label)
EUROSAT_CLASSES = [
    "AnnualCrop",
    "Forest",
    "HerbaceousVegetation",
    "Highway",
    "Industrial",
    "Pasture",
    "PermanentCrop",
    "Residential",
    "River",
    "SeaLake",
]
