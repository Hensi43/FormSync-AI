# ⚡ QUICK START

Follow these steps to get FormSync AI running locally.

## Prerequisites

- **Node.js 18+**
- **Python 3.11+**
- **Google Cloud Console Project** (for OAuth & Gemini)

## 1. Backend Setup (FastAPI)

Navigate to the API directory:
```bash
cd apps/api
```

Create environment file:
```bash
# create from example
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

Setup Google Credentials (Required for Google Forms):
1. Download `client_secret_XPX.json` from Google Cloud Console (OAuth Client ID).
2. Save it as `credentials.json` in `apps/api/`.
3. Ensure Redirect URI in cloud console matches `http://localhost:8000/api/v1/google/auth/callback`.

Install and Run:
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Start Server
uvicorn main:app --reload --port 8000
```
> API will run at `http://localhost:8000`. Documentation at `/docs`.

## 2. Frontend Setup (Next.js)

Open a new terminal and navigate to the Web directory:
```bash
cd apps/web
```

Install and Run:
```bash
npm install
npm run dev
```
> Frontend will run at `http://localhost:3000`.

## 3. Verify System

1. Open `http://localhost:3000`.
2. Check the **System Status** card. It should show "Backend API: Connected".
3. Enter a prompt like "Create a waiting list form" and click **Generate**.
