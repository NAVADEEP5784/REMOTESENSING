"""
Train the classification model on EuroSAT dataset.
EuroSAT has 10 classes (single-label). Put EuroSAT_RGB folder in datasets/.

Expected structure:
  datasets/
    EuroSAT_RGB/
      AnnualCrop/
      Forest/
      HerbaceousVegetation/
      Highway/
      Industrial/
      Pasture/
      PermanentCrop/
      Residential/
      River/
      SeaLake/
"""

import argparse
import sys
from pathlib import Path

print("Loading...", flush=True)
sys.stdout.flush()

import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torchvision import datasets, transforms
from torchvision import models

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


class EuroSATResNet18(nn.Module):
    """ResNet18 for EuroSAT 10-class single-label classification (Softmax). Faster than ResNet50."""

    def __init__(self, num_classes: int = 10, pretrained: bool = True):
        super().__init__()
        self.resnet = models.resnet18(
            weights=models.ResNet18_Weights.IMAGENET1K_V1 if pretrained else None
        )
        in_features = self.resnet.fc.in_features
        self.resnet.fc = nn.Identity()
        self.classifier = nn.Sequential(
            nn.Linear(in_features, 512),
            nn.ReLU(inplace=True),
            nn.Dropout(0.5),
            nn.Linear(512, num_classes),
        )
        self.num_classes = num_classes

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        features = self.resnet(x)
        return self.classifier(features)


def main():
    print("Starting EuroSAT training...", flush=True)
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--data",
        type=str,
        default="../datasets",
        help="Path to EuroSAT folder (with AnnualCrop, Forest, etc. inside)",
    )
    parser.add_argument("--epochs", type=int, default=5)
    parser.add_argument("--batch-size", type=int, default=32)
    parser.add_argument("--lr", type=float, default=1e-4)
    parser.add_argument("--output", type=str, default="models/eurosat_model.pth")
    args = parser.parse_args()

    data_path = Path(args.data).resolve()
    print(f"Data path: {data_path}", flush=True)
    if not data_path.exists():
        print(f"Error: EuroSAT data not found at {data_path}")
        print("Expected: datasets/ with AnnualCrop, Forest, etc. folders inside")
        return

    transform_train = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomRotation(15),
        transforms.ColorJitter(brightness=0.2, contrast=0.2),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
    ])
    transform_val = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
    ])

    print("Loading dataset (scanning images)...", flush=True)
    train_ds = datasets.ImageFolder(
        str(data_path),
        transform=transform_train,
    )
    # Use 90% train, 10% val by splitting
    n = len(train_ds)
    n_val = max(1, n // 10)
    n_train = n - n_val
    print(f"Found {n} images. Splitting train/val...", flush=True)
    train_ds, val_ds = torch.utils.data.random_split(
        train_ds, [n_train, n_val],
        generator=torch.Generator().manual_seed(42),
    )

    print("Creating data loaders...", flush=True)
    train_loader = DataLoader(
        train_ds, batch_size=args.batch_size, shuffle=True, num_workers=0, pin_memory=False
    )
    val_loader = DataLoader(
        val_ds, batch_size=args.batch_size, shuffle=False, num_workers=0
    )

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Device: {device}. Loading ResNet18 (faster, ~45MB weights)...", flush=True)
    model = EuroSATResNet18(num_classes=10, pretrained=True).to(device)
    print("Model loaded. Starting training...", flush=True)
    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.AdamW(model.parameters(), lr=args.lr)

    total_batches = len(train_loader)
    for epoch in range(args.epochs):
        model.train()
        train_loss = 0.0
        correct = 0
        total = 0
        for batch_idx, (images, labels) in enumerate(train_loader):
            if batch_idx % 50 == 0:
                print(f"  Epoch {epoch+1} batch {batch_idx}/{total_batches}...", flush=True)
            images, labels = images.to(device), labels.to(device)
            optimizer.zero_grad()
            logits = model(images)
            loss = criterion(logits, labels)
            loss.backward()
            optimizer.step()
            train_loss += loss.item()
            _, pred = logits.max(1)
            total += labels.size(0)
            correct += pred.eq(labels).sum().item()

        train_acc = 100.0 * correct / total
        model.eval()
        val_correct = 0
        val_total = 0
        with torch.no_grad():
            for images, labels in val_loader:
                images, labels = images.to(device), labels.to(device)
                logits = model(images)
                _, pred = logits.max(1)
                val_total += labels.size(0)
                val_correct += pred.eq(labels).sum().item()

        val_acc = 100.0 * val_correct / val_total
        print(
            f"Epoch {epoch + 1}/{args.epochs} | Loss: {train_loss / len(train_loader):.4f} | "
            f"Train Acc: {train_acc:.2f}% | Val Acc: {val_acc:.2f}%"
        )

    Path("models").mkdir(exist_ok=True)
    torch.save(model.state_dict(), args.output)
    print(f"Saved model to {args.output}")


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"Error: {e}", flush=True)
        raise
