# Deployment Guide

This project is configured for automated deployment on **Railway** (Backend) and **Vercel** (Frontend).

## 1. Backend Deployment (Railway)

1.  Sign up/Log in to [Railway.app](https://railway.app/).
2.  Click **"New Project"** -> **"Deploy from GitHub repo"**.
3.  Select this repository (`Hensi43/FormSync-AI`).
4.  **Important**: Railway might try to deploy the root. You need to configure it for the API.
    *   Go to **Settings** -> **Root Directory** and set it to `/apps/api`.
    *   The `Procfile` in `apps/api` will automatically tell Railway how to start the server.
5.  Go to the **Variables** tab and add:
    *   `GEMINI_API_KEY`: (Your Google Gemini Key)
    *   `SUPABASE_URL`: (Your Supabase URL)
    *   `SUPABASE_KEY`: (Your Supabase Anon Key)
6.  Go to **Settings** -> **Networking** and click **"Generate Domain"**.
    *   Copy this URL (e.g., `https://web-production-xxxx.up.railway.app`). You will need it for the frontend.

## 2. Frontend Deployment (Vercel)

1.  Sign up/Log in to [Vercel.com](https://vercel.com/).
2.  Click **"Add New..."** -> **"Project"**.
3.  Import the `FormSync-AI` repository.
4.  Vercel should automatically detect Next.js.
5.  **Configure Project**:
    *   **Root Directory**: Click "Edit" and select `apps/web`.
6.  **Environment Variables**:
    *   `NEXT_PUBLIC_API_URL`: Paste the Railway URL from Step 1 (e.g., `https://web-production-xxxx.up.railway.app`).
    *   **Note**: Do NOT add a trailing slash (e.g., use `...app`, not `...app/`).
7.  Click **"Deploy"**.

## 3. Verify

1.  Open your Vercel URL.
2.  Try generating a form.
3.  If it works, you are fully live! 🚀
