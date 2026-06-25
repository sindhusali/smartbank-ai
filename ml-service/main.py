from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
import pandas as pd

app = FastAPI(title="SmartBank Fraud Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

print("Loading fraud detection model...")
model = joblib.load('fraud_model.pkl')
feature_names = joblib.load('feature_names.pkl')

# Fit a fresh scaler using known dataset statistics
# (avoids the saved scaler column mismatch issue)
from sklearn.preprocessing import StandardScaler
amount_scaler = StandardScaler()
amount_scaler.mean_ = np.array([88.3496])
amount_scaler.scale_ = np.array([250.1201])
amount_scaler.var_ = np.array([62560.1])
amount_scaler.n_features_in_ = 1

time_scaler = StandardScaler()
time_scaler.mean_ = np.array([94813.8])
time_scaler.scale_ = np.array([47488.1])
time_scaler.var_ = np.array([2255118721.0])
time_scaler.n_features_in_ = 1

print("✅ Model loaded successfully")

class SimpleTransactionData(BaseModel):
    amount: float
    hour_of_day: float = 12.0
    is_new_recipient: bool = False
    recent_transfer_count: int = 0
    avg_transfer_amount: float = 0.0

@app.get("/")
def root():
    return {"status": "SmartBank Fraud Detection API is running"}

@app.get("/health")
def health():
    return {"status": "healthy", "model": "XGBoost", "roc_auc": 0.9734}

@app.post("/predict")
def predict(data: SimpleTransactionData):
    # V14 and V17 are the strongest fraud predictors in this dataset
    v14 = -3.5 if (data.is_new_recipient and data.amount > 100000) else (
          -1.5 if data.is_new_recipient else 0.5)
    v17 = -4.0 if data.recent_transfer_count >= 3 else (
          -1.5 if data.recent_transfer_count >= 2 else 0.3)
    v12 = -2.5 if data.amount > 100000 else (
          -1.0 if data.amount > 50000 else 0.2)
    v10 = -2.0 if data.is_new_recipient else 0.1
    v3  = -1.5 if data.amount > 50000 else 0.3
    v7  = -1.0 if data.recent_transfer_count >= 3 else 0.1

    features = {
        'Time': data.hour_of_day * 3600,
        'V1':  -1.5 if data.is_new_recipient else 0.2,
        'V2':   0.5,
        'V3':   v3,
        'V4':   0.8,
        'V5':   0.1,
        'V6':   0.2,
        'V7':   v7,
        'V8':   0.3,
        'V9':   0.1,
        'V10':  v10,
        'V11':  0.4,
        'V12':  v12,
        'V13':  0.1,
        'V14':  v14,
        'V15':  0.2,
        'V16': -1.0 if data.amount > 100000 else 0.1,
        'V17':  v17,
        'V18':  0.1,
        'V19':  0.2,
        'V20':  0.1,
        'V21':  0.0,
        'V22':  0.1,
        'V23':  0.0,
        'V24':  0.1,
        'V25':  0.0,
        'V26':  0.1,
        'V27':  0.0,
        'V28':  0.0,
        'Amount': data.amount,
    }

    df = pd.DataFrame([features])[feature_names]

    # Scale Amount and Time separately with correct scalers
    df['Amount'] = amount_scaler.transform(df[['Amount']])
    df['Time']   = time_scaler.transform(df[['Time']])

    risk_score = float(model.predict_proba(df)[0][1])

    # Apply real banking rule boosts on top of ML score
    if data.is_new_recipient:
        risk_score = min(risk_score + 0.15, 0.99)
    if data.recent_transfer_count >= 3:
        risk_score = min(risk_score + 0.10, 0.99)
    if data.amount > 100000:
        risk_score = min(risk_score + 0.10, 0.99)

    flagged = risk_score >= 0.45

    reasons = []
    if data.amount > 100000:
        reasons.append("transfer exceeds Rs 1,00,000")
    if data.is_new_recipient:
        reasons.append("first transfer to this recipient")
    if data.recent_transfer_count >= 3:
        reasons.append("multiple transfers in the last hour")
    if data.avg_transfer_amount > 0 and data.amount > data.avg_transfer_amount * 3:
        reasons.append("amount significantly higher than your average transfer")

    return {
        "risk_score": round(risk_score, 4),
        "flagged": flagged,
        "reasons": reasons,
        "model": "XGBoost",
        "roc_auc": 0.9734
    }