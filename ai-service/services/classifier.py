"""Land cover classification service - supports multi-label (7 classes) or EuroSAT (10 classes)."""

import io
from pathlib import Path

import numpy as np
import torch
from PIL import Image
from torchvision import transforms

# Add parent for imports when run as module
import sys
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from models.classification_model import MultiLabelResNet50
from config import (
    LAND_COVER_CLASSES,
    EUROSAT_CLASSES,
    EUROSAT_WEIGHTS,
    IMAGE_SIZE,
    MEAN,
    STD,
    CLASSIFICATION_WEIGHTS,
)


class EuroSATResNet18(torch.nn.Module):
    """ResNet18 for EuroSAT 10-class single-label (Softmax)."""

    def __init__(self, num_classes: int = 10, pretrained: bool = True):
        super().__init__()
        from torchvision import models
        self.resnet = models.resnet18(
            weights=models.ResNet18_Weights.IMAGENET1K_V1 if pretrained else None
        )
        in_features = self.resnet.fc.in_features
        self.resnet.fc = torch.nn.Identity()
        self.classifier = torch.nn.Sequential(
            torch.nn.Linear(in_features, 512),
            torch.nn.ReLU(inplace=True),
            torch.nn.Dropout(0.5),
            torch.nn.Linear(512, num_classes),
        )
        self.num_classes = num_classes

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        features = self.resnet(x)
        return self.classifier(features)


class LandCoverClassifier:
    def __init__(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.use_eurosat = Path(EUROSAT_WEIGHTS).exists()

        if self.use_eurosat:
            self.model = EuroSATResNet18(num_classes=10, pretrained=True)
            state = torch.load(EUROSAT_WEIGHTS, map_location=self.device)
            self.model.load_state_dict(state, strict=True)
            self.classes = EUROSAT_CLASSES
        else:
            self.model = MultiLabelResNet50(
                num_classes=len(LAND_COVER_CLASSES), pretrained=True
            )
            weights_path = Path(CLASSIFICATION_WEIGHTS)
            if weights_path.exists():
                state = torch.load(weights_path, map_location=self.device)
                self.model.load_state_dict(state, strict=False)
            self.classes = LAND_COVER_CLASSES

        self.model.eval()
        self.model.to(self.device)

        self.transform = transforms.Compose([
            transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
            transforms.ToTensor(),
            transforms.Normalize(mean=MEAN, std=STD),
        ])

    def predict(self, image_bytes: bytes) -> list[dict]:
        """Predict land cover. Returns list of {class, probability}."""
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        tensor = self.transform(image).unsqueeze(0).to(self.device)

        with torch.no_grad():
            logits = self.model(tensor)
            probs = logits.cpu().numpy()[0]

        if self.use_eurosat:
            # Softmax for single-label
            probs = np.exp(probs) / np.exp(probs).sum()
        else:
            # Sigmoid already applied in model
            total = np.sum(probs)
            if total > 0:
                probs = probs / total

        percentages = (probs * 100).tolist()
        results = [
            {"class": cls, "probability": round(p, 2)}
            for cls, p in zip(self.classes, percentages)
        ]
        results.sort(key=lambda x: x["probability"], reverse=True)
        return results
