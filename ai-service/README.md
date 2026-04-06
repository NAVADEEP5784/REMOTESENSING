# AI Service

FastAPI service for satellite image analysis.

## Setup

```bash
pip install -r requirements.txt
```

## Train on EuroSAT

1. Ensure `datasets/` has class folders: AnnualCrop, Forest, HerbaceousVegetation, etc.
2. From ai-service folder:

```bash
python train_eurosat.py --data ../datasets
```

After training, the AI service will automatically use the EuroSAT model for classification (10 classes).

## Run

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
