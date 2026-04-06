"""YOLOv8 object detection service for satellite imagery."""

import io

import cv2
import numpy as np
from PIL import Image
from ultralytics import YOLO

from config import YOLO_MODEL

# Map YOLO COCO class indices to our satellite-relevant labels
# COCO: 0=person, 1=bicycle, 2=car, 3=motorcycle, 4=airplane, 5=bus, 6=train, 7=truck,
# 8=boat, 9=traffic light, 10=fire hydrant, 11=stop sign, 12=parking meter, 13=bench,
# 14=bird, 15=cat, 16=dog, 17=horse, 18=sheep, 19=cow, 20=elephant, 21=bear, 22=zebra,
# 23=giraffe, 24=backpack, 25=umbrella, 26=handbag, 27=tie, 28=suitcase, 29=frisbee,
# 30=skis, 31=snowboard, 32=sports ball, 33=kite, 34=baseball bat, 35=baseball glove,
# 36=skateboard, 37=surfboard, 38=tennis racket, 39=bottle, 40=wine glass, 41=cup,
# 42=fork, 43=knife, 44=spoon, 45=bowl, 46=banana, 47=apple, 48=sandwich, 49=orange,
# 50=broccoli, 51=carrot, 52=hot dog, 53=pizza, 54=donut, 55=cake, 56=chair, 57=couch,
# 58=potted plant, 59=bed, 60=dining table, 61=toilet, 62=tv, 63=laptop, 64=mouse,
# 65=remote, 66=keyboard, 67=cell phone, 68=microwave, 69=oven, 70=toaster, 71=sink,
# 72=refrigerator, 73=book, 74=clock, 75=vase, 76=scissors, 77=teddy bear, 78=hair drier,
# 79=toothbrush

COCO_TO_SATELLITE = {
    2: "Vehicles", 3: "Vehicles", 5: "Vehicles", 7: "Vehicles",  # car, motorcycle, bus, truck
    4: "Other structures", 6: "Other structures", 8: "Other structures",  # airplane, train, boat
    56: "Buildings", 57: "Buildings", 59: "Buildings",  # chair, couch, bed - indoor, map to buildings
    32: "Sports fields", 33: "Sports fields",  # sports ball, kite
    62: "Buildings", 67: "Buildings",  # tv, cell - structures
}
DEFAULT_LABEL = "Other structures"


class ObjectDetector:
    def __init__(self):
        self.model = YOLO(YOLO_MODEL)

    def detect(self, image_bytes: bytes) -> tuple[bytes, list[dict]]:
        """
        Run YOLOv8 detection. Returns (annotated_image_bytes, detections).
        Detections: [{class, confidence, bbox}]
        """
        img_array = np.frombuffer(image_bytes, dtype=np.uint8)
        img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
        if img is None:
            pil = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            img = cv2.cvtColor(np.array(pil), cv2.COLOR_RGB2BGR)

        results = self.model(img, conf=0.25, verbose=False)
        detections = []
        annotated = img.copy()

        for r in results:
            boxes = r.boxes
            for box in boxes:
                xyxy = box.xyxy[0].cpu().numpy()
                conf = float(box.conf[0])
                cls_id = int(box.cls[0])
                label = COCO_TO_SATELLITE.get(cls_id, r.names.get(cls_id, DEFAULT_LABEL))

                x1, y1, x2, y2 = map(int, xyxy)
                cv2.rectangle(annotated, (x1, y1), (x2, y2), (0, 255, 0), 2)
                cv2.putText(
                    annotated, f"{label} {conf:.2f}",
                    (x1, y1 - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1
                )

                detections.append({
                    "class": label,
                    "confidence": round(conf, 2),
                    "bbox": [x1, y1, x2 - x1, y2 - y1],
                })

        # Encode annotated image
        _, buffer = cv2.imencode(".png", annotated)
        return buffer.tobytes(), detections
