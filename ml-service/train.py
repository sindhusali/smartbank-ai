import pandas as pd
import numpy as np
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, roc_auc_score
from sklearn.preprocessing import StandardScaler
import joblib

print("Loading dataset...")
df = pd.read_csv('creditcard.csv')
print(f"Dataset shape: {df.shape}")
print(f"Fraud cases: {df['Class'].sum()} ({df['Class'].mean()*100:.2f}%)")

X = df.drop('Class', axis=1)
y = df['Class']

# Scale Amount and Time (other features are already PCA-transformed)
scaler = StandardScaler()
X['Amount'] = scaler.fit_transform(X[['Amount']])
X['Time'] = scaler.fit_transform(X[['Time']])

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print("\nTraining XGBoost model...")
fraud_ratio = (y == 0).sum() / (y == 1).sum()
model = XGBClassifier(
    scale_pos_weight=fraud_ratio,
    n_estimators=100,
    max_depth=6,
    learning_rate=0.1,
    random_state=42,
    eval_metric='logloss',
    use_label_encoder=False,
)
model.fit(X_train, y_train)

print("\nEvaluating model...")
y_pred = model.predict(X_test)
y_prob = model.predict_proba(X_test)[:, 1]
print(classification_report(y_test, y_pred, target_names=['Normal', 'Fraud']))
print(f"ROC-AUC Score: {roc_auc_score(y_test, y_prob):.4f}")

print("\nSaving model and scaler...")
joblib.dump(model, 'fraud_model.pkl')
joblib.dump(scaler, 'scaler.pkl')
joblib.dump(list(X.columns), 'feature_names.pkl')
print("✅ Model saved as fraud_model.pkl")
print("✅ Scaler saved as scaler.pkl")
print("✅ Feature names saved as feature_names.pkl")