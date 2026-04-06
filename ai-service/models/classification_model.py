"""
Multi-label land cover classification model using ResNet50 backbone.
Uses Sigmoid activation and outputs probabilities for each class.
"""

import torch
import torch.nn as nn
from torchvision import models


class MultiLabelResNet50(nn.Module):
    """ResNet50 with multi-label classification head (Sigmoid)."""

    def __init__(self, num_classes: int = 7, pretrained: bool = True):
        super().__init__()
        self.resnet = models.resnet50(weights=models.ResNet50_Weights.IMAGENET1K_V1 if pretrained else None)
        # Remove original fully connected layer
        in_features = self.resnet.fc.in_features
        self.resnet.fc = nn.Identity()

        self.classifier = nn.Sequential(
            nn.Linear(in_features, 512),
            nn.ReLU(inplace=True),
            nn.Dropout(0.5),
            nn.Linear(512, num_classes),
            nn.Sigmoid(),
        )
        self.num_classes = num_classes

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        features = self.resnet(x)
        return self.classifier(features)
