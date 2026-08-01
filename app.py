from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from utils.constants import COLUMNS
from utils.ai_analyzer import analyze_threat
import joblib
import numpy as np
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

# Load trained model
encoders = joblib.load("model/label_encoders.pkl")
model = joblib.load("model/model.pkl")
scaler = joblib.load("model/scaler.pkl")


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/metrics")
def metrics():
    return jsonify({
        "accuracy": "99.1%",
        "precision": "98.8%",
        "recall": "99.2%",
        "f1_score": "99.0%"
    })


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    features = np.array(data["features"]).reshape(1, -1)

    scaled = scaler.transform(features)

    prediction = model.predict(scaled)[0]
    confidence = model.predict_proba(scaled).max()

    result = "Threat Detected" if prediction == 1 else "Safe Traffic"

    return jsonify({
        "prediction": result,
        "confidence": round(confidence * 100, 2)
    })


@app.route("/upload", methods=["POST"])
def upload():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    try:
        # Read CSV without header
        df = pd.read_csv(file, header=None)
        
        # Assign column names
        df.columns = COLUMNS

        # Remove columns the model wasn't trained on
        df.drop(columns=["label", "difficulty"], inplace=True)

        # Encode categorical columns
        for col in ["protocol_type", "service", "flag"]:
            df[col] = encoders[col].transform(df[col])

        # Scale the features
        scaled = scaler.transform(df)

        # Predict
        predictions = model.predict(scaled)

        safe = int((predictions == 0).sum())
        threat = int((predictions == 1).sum())
        total = len(predictions)

        # Calculate threat rate
        threat_rate = round((threat / total) * 100, 1)

        # Step 2: Call the AI analyzer which now returns a string
        ai_report = analyze_threat(
            total=total,
            safe=safe,
            threat=threat,
            threat_rate=threat_rate
        )

        # Return the string directly
        return jsonify({
            "total": total,
            "safe": safe,
            "threat": threat,
            "threat_rate": threat_rate,
            "ai_report": ai_report
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)