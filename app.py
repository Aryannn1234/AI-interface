from flask import Flask, render_template, request, jsonify
from PIL import Image
import tensorflow as tf
import numpy as np
import time

# TensorFlow MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import (
    MobileNetV2,
    preprocess_input,
    decode_predictions
)

app = Flask(__name__)

# Load model only once when the app starts
model = MobileNetV2(weights="imagenet")


@app.route("/")
def home():
    return render_template("home.html")


@app.route("/workspace")
def workspace():
    return render_template("workspace.html")


@app.route("/predict", methods=["POST"])
def predict():

    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"})

    file = request.files["image"]

    image = Image.open(file).convert("RGB")
    image = image.resize((224, 224))

    img_array = np.array(image)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)

    start_time = time.time()

    predictions = model.predict(img_array)

    decoded = decode_predictions(predictions, top=5)[0]

    results = []

    for item in decoded:
        results.append({
            "label": item[1].replace("_", " ").title(),
            "confidence": round(float(item[2]) * 100, 2)
        })

    end_time = time.time()

    return jsonify({
        "predictions": results,
        "inference_time": round(end_time - start_time, 3)
    })

if __name__ == "__main__":
    app.run(debug=True)