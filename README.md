# 🛡️ AI Cyber Threat Detection System

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.13-blue?style=for-the-badge&logo=python">
  <img src="https://img.shields.io/badge/Flask-Web_App-black?style=for-the-badge&logo=flask">
  <img src="https://img.shields.io/badge/Machine_Learning-Random_Forest-success?style=for-the-badge">
  <img src="https://img.shields.io/badge/Groq-AI_Analysis-orange?style=for-the-badge">
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge">
</p>

---

## 📌 Overview

AI Cyber Threat Detection System is a Machine Learning-powered web application that detects malicious network traffic using the **NSL-KDD Dataset** and a **Random Forest Classifier**.

The application provides:

- 🔍 Real-time network traffic prediction
- 📂 Batch prediction using uploaded datasets
- 📊 Live analytics dashboard
- 🤖 AI-generated cybersecurity analysis using Groq LLM
- 📄 PDF report generation
- 📥 CSV report download
- 🌐 Deployed on Render

---

## 🌐 Live Demo

👉 **Live Website**

https://ai-cyber-threat-detection-h0vl.onrender.com

---

## 💻 GitHub Repository

https://github.com/adoresanjali/AI-Cyber-Threat-Detection

---

# ✨ Features

- ✅ Random Forest Intrusion Detection Model
- ✅ Upload NSL-KDD Dataset
- ✅ Single Network Traffic Prediction
- ✅ Live Threat Analytics
- ✅ AI Threat Analysis (Groq LLM)
- ✅ Threat Distribution Dashboard
- ✅ Detection History
- ✅ PDF Report Download
- ✅ CSV Report Download
- ✅ Responsive UI
- ✅ Fully Deployed on Render

---

# 🖥️ Screenshots

## Dashboard

![Dashboard](assets/dashboard.png)

---

## Upload & Prediction

![Upload](assets/upload.png)

---

## Analytics Dashboard

![Analytics](assets/analytics.png)

---

## AI Threat Analysis

![AI Analysis](assets/ai-analysis.png)

---

## PDF Report

![PDF](assets/pdf-report.png)

---

# ⚙️ Tech Stack

## Frontend

- HTML5
- CSS3
- Bootstrap 5
- JavaScript

## Backend

- Flask
- Flask-CORS

## Machine Learning

- Random Forest
- Scikit-learn
- Pandas
- NumPy

## AI

- Groq API
- Llama Model

## Deployment

- Render

---

# 📂 Project Structure

```text
AI-Cyber-Threat-Detection
│
├── assets/
├── dataset/
├── model/
│   ├── model.pkl
│   ├── scaler.pkl
│   └── label_encoders.pkl
│
├── static/
│   ├── css/
│   └── js/
│
├── templates/
│   └── index.html
│
├── utils/
│
├── app.py
├── requirements.txt
├── train_model.py
└── README.md
```

---

# 🧠 Machine Learning Workflow

```
NSL-KDD Dataset
        │
        ▼
Data Preprocessing
        │
        ▼
Label Encoding
        │
        ▼
Feature Scaling
        │
        ▼
Random Forest Model
        │
        ▼
Prediction
        │
        ▼
Threat Analytics
        │
        ▼
Groq AI Analysis
        │
        ▼
Dashboard + PDF Report
```

---

# 🚀 Installation



Move into the project

```bash
cd AI-Cyber-Threat-Detection
```

Create virtual environment

```bash
python -m venv venv
```

Activate virtual environment

### Windows

```bash
venv\Scripts\activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Create a `.env` file

```env
GROQ_API_KEY=YOUR_GROQ_API_KEY
```

Run the application

```bash
python app.py
```

---

# 📊 Model Performance

| Metric | Score |
|---------|-------|
| Accuracy | **99.1%** |
| Precision | **98.8%** |
| Recall | **99.2%** |
| F1 Score | **99.0%** |

---

# 📈 Dataset

Dataset Used:

**NSL-KDD**

Files:

- KDDTrain+.txt
- KDDTest+.txt

---

# 📄 Reports

The system generates:

- PDF Threat Report
- CSV Threat Report

---

# 🔮 Future Enhancements

- 🔹 Live Network Packet Capture
- 🔹 Real-time IDS Integration
- 🔹 SIEM Dashboard
- 🔹 Threat Heatmaps
- 🔹 User Authentication
- 🔹 Database Integration
- 🔹 Email Alerts
- 🔹 Docker Deployment
- 🔹 Kubernetes Support

---

# 👨‍💻 Developer

**Anjali Sharma**

CSE-AI&ML

GitHub

https://github.com/adoresanjali

LinkedIn

https://www.linkedin.com/in/anjali-831492344/

---

# ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub.

It motivates me to build more AI and Cybersecurity projects.

---

# 📜 License

This project is licensed under the MIT License.
