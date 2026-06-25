# SmartBank AI — Intelligent Banking & Fraud Detection Platform

A full-stack banking application with real-time AI-powered fraud detection.

## Tech Stack
- **Frontend:** React.js, React Router
- **Backend:** Node.js, Express.js, JWT Auth
- **Database:** PostgreSQL (Neon)
- **ML Model:** XGBoost (97.3% ROC-AUC) served via FastAPI
- **AI Explanations:** Groq LLaMA 3.1 (natural language fraud alerts)

## Features
- Secure JWT authentication
- Multi-account management
- Real-time money transfers
- XGBoost fraud detection model trained on 284,807 transactions
- AI-generated plain-English fraud explanations
- Transaction history with filters
- Spending analytics dashboard
- PDF bank statement download

## Architecture
React Frontend → Node.js API → PostgreSQL
                            → FastAPI ML Service (XGBoost)
                            → Groq AI (LLaMA 3.1)

## Running Locally

### Backend
cd backend
npm install
npm run dev

### ML Service
cd ml-service
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

### Frontend
cd frontend
npm install
npm start
