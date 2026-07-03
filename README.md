# SmartBank AI 🏦
> Full-stack intelligent banking platform with real-time XGBoost fraud detection and Groq LLaMA AI explanations

![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![XGBoost](https://img.shields.io/badge/XGBoost-FF6600?style=flat&logo=xgboost&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=flat&logo=render&logoColor=black)

---

## 🌐 Live Demo

| Service | URL |
|---|---|
| Frontend | https://smartbank-ai-snowy.vercel.app |
| Backend API | https://smartbank-ai-backend.onrender.com |

**Demo credentials**
```
Email:    test@example.com
Password: SmartBank123!
```

> ⚠️ The backend runs on Render's free tier — first request may take 30 seconds to wake up.

---

## 🎯 ML Model Performance

Trained on the [Kaggle Credit Card Fraud Dataset](https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud) — 284,807 real transactions, 0.17% fraud rate.

| Metric | Score |
|---|---|
| ROC-AUC | **97.34%** |
| Fraud Precision | **80%** |
| Fraud Recall | **84%** |
| Normal Transaction Accuracy | **100%** |
| Training Samples | **284,807** |
| Inference | **Real-time** |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────┐
│         React Frontend (Vercel)          │
└──────────────────┬──────────────────────┘
                   │ HTTPS + JWT
┌──────────────────▼──────────────────────┐
│      Node.js + Express API (Render)      │
│         JWT Auth · bcrypt · CORS         │
└────────┬─────────────────────┬──────────┘
         │                     │
┌────────▼──────┐   ┌──────────▼──────────┐
│  PostgreSQL   │   │  FastAPI ML Service  │
│  (Neon Cloud) │   │  XGBoost Model       │
│               │   │  ROC-AUC: 97.3%      │
└───────────────┘   └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  Groq LLaMA 3.1     │
                    │  AI Fraud Explainer  │
                    └─────────────────────┘
```

---

## ✨ Features

### 🔐 Authentication
- JWT-secured login and registration
- bcrypt password hashing (salt rounds: 10)
- Session management with localStorage / sessionStorage
- Failed attempt tracking with account lockout

### 🏦 Banking
- Multi-account management (savings + current)
- Real-time deposits and money transfers
- Account number generation
- Account freeze support (admin)

### 🚨 AI Fraud Detection
- **XGBoost ML model** trained on 284,807 real transactions
- Real-time risk scoring on every transfer (0.0 – 1.0)
- **Groq LLaMA 3.1** generates plain-English fraud explanations
- Fraud flags stored in database with full audit trail
- Blocking confirmation modal for high-risk transfers

### 📊 Analytics & Reporting
- Monthly inflow / outflow bar charts (canvas-based, no Chart.js)
- Transaction type breakdown donut chart
- AI-powered spending insights via Groq
- Fraud rate statistics panel
- PDF bank statement export (browser print API)

### 🗂️ Transaction History
- Full paginated transaction log
- Filter by type (deposit / transfer / withdrawal) and risk status
- Search by name, account number, or amount
- Expandable AI explanation rows for flagged transactions
- PhonePe-style "To / From" recipient display

---

## 📸 Screenshots

### Login & Register
![Login Page](screenshots/login.png)
![Register Page](screenshots/register.png)

### Dashboard
![Dashboard](screenshots/dashboard.png)
![Recent Transactions](screenshots/dashboard-transactions.png)

### Accounts
![Accounts Page](screenshots/accounts.png)

### Transfer + AI Fraud Detection
![Transfer Form](screenshots/transfer-form.png)
![Fraud Warning Modal with AI Explanation](screenshots/transfer-fraud-modal.png)
![Transfer Success](screenshots/transfer-done.png)

### Transaction History
![Transactions](screenshots/transactions.png)
![AI Explanation Expanded](screenshots/transactions-ai-expanded.png)

### Analytics
![Analytics Charts](screenshots/analytics-charts.png)
![AI Spending Insight](screenshots/analytics-insight.png)

### Profile
![Profile](screenshots/profile-top.png)
![Security Settings](screenshots/profile-security.png)

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React.js, React Router | UI, routing, state management |
| Backend | Node.js, Express.js | REST API, business logic |
| Auth | JWT, bcrypt | Secure authentication |
| Database | PostgreSQL on Neon | Persistent data storage |
| ML Model | XGBoost, scikit-learn | Fraud risk scoring |
| ML Service | Python, FastAPI | ML microservice |
| GenAI | Groq LLaMA 3.1 | Plain-English fraud explanations |
| Deployment | Vercel + Render | Frontend + backend hosting |

---

## 🚀 Running Locally

### Prerequisites
- Node.js 18+
- Python 3.10+
- PostgreSQL database (or free [Neon](https://neon.tech) account)
- [Groq API key](https://console.groq.com) (free)

### 1 · Clone the repo
```bash
git clone https://github.com/sindhusali/smartbank-ai.git
cd smartbank-ai
```

### 2 · Backend
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=5000
DATABASE_URL=your_neon_postgresql_connection_string
JWT_SECRET=your_random_secret_key
GROQ_API_KEY=your_groq_api_key
```

```bash
npm run dev
# Server running on http://localhost:5000
```

### 3 · Database
Run `backend/db/schema.sql` against your PostgreSQL database to create all 5 tables.

### 4 · ML Service
```bash
cd ../ml-service
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux
pip install -r requirements.txt
python train.py              # Train the XGBoost model (~2 mins)
uvicorn main:app --reload --port 8000
# ML service running on http://localhost:8000
```

> Download the [Kaggle credit card fraud dataset](https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud) and place `creditcard.csv` in the `ml-service/` folder before training.

### 5 · Frontend
```bash
cd ../frontend
npm install
npm start
# App running on http://localhost:3000
```

---

## 📁 Project Structure

```
smartbank-ai/
├── frontend/                 # React application
│   └── src/
│       ├── pages/            # Login, Register, Dashboard, Accounts,
│       │                     # Transfer, Transactions, Analytics, Profile
│       └── components/       # PrivateRoute, shared components
│
├── backend/                  # Node.js + Express API
│   ├── routes/               # auth.js, accounts.js, transactions.js
│   ├── middleware/            # auth.js (JWT verification)
│   ├── services/             # aiExplainer.js (Groq integration)
│   └── db/                   # schema.sql, index.js (connection pool)
│
└── ml-service/               # Python FastAPI ML microservice
    ├── main.py               # FastAPI app + /predict endpoint
    ├── train.py              # XGBoost training script
    └── requirements.txt      # Python dependencies
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login + get JWT | ❌ |
| GET | `/api/accounts` | Get user accounts | ✅ |
| POST | `/api/accounts` | Create new account | ✅ |
| GET | `/api/transactions` | Get transaction history | ✅ |
| POST | `/api/transactions/deposit` | Deposit money | ✅ |
| POST | `/api/transactions/transfer` | Transfer + fraud check | ✅ |

---

## 🧠 How Fraud Detection Works

```
User initiates transfer
        ↓
Node.js backend calls FastAPI ML service
        ↓
XGBoost model scores the transaction (0.0 – 1.0)
based on: amount vs average, recipient history,
transfer frequency, time of day
        ↓
Score ≥ 0.45 → Flagged
        ↓
Groq LLaMA 3.1 generates plain-English explanation
"This transaction was flagged because the amount of
₹1,10,000 exceeds your usual transfer range and is
being sent to a first-time recipient..."
        ↓
Frontend shows blocking fraud modal with AI explanation
User can cancel or proceed
        ↓
Transaction + fraud flag saved to PostgreSQL
```

---

## 👩‍💻 Author

**Sali Sindhu Sri**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://linkedin.com/in/sindhu-sri-sali-6867463b2/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/sindhusali)
[![Portfolio](https://img.shields.io/badge/Portfolio-FF5722?style=flat&logo=firefox&logoColor=white)](https://sindhusali.github.io/sindhusrisali.github.io/)

---

## 📄 License

MIT License — feel free to use this project as a reference or template.
