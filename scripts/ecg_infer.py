#!/usr/bin/env python3
import argparse
import json
import sys

import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

CLASSES = ["HB", "MI", "PMI", "Normal"]


def main() -> int:
    parser = argparse.ArgumentParser(description="Run ECG classification on an image.")
    parser.add_argument("--image", required=True, help="Path to image file")
    parser.add_argument("--model", required=True, help="Path to keras/h5 model file")
    args = parser.parse_args()

    try:
        model = load_model(args.model)
        img = image.load_img(args.image, target_size=(224, 224))
        arr = image.img_to_array(img) / 255.0
        arr = np.expand_dims(arr, axis=0)

        pred = model.predict(arr, verbose=0)[0]
        best_idx = int(np.argmax(pred))
        best_confidence = float(pred[best_idx]) * 100.0

        probabilities = {CLASSES[i]: round(float(pred[i]) * 100.0, 2) for i in range(len(CLASSES))}
        payload = {
            "label": CLASSES[best_idx],
            "confidence": round(best_confidence, 2),
            "probabilities": probabilities,
        }
        print(json.dumps(payload))
        return 0
    except Exception as exc:
        print(str(exc), file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
