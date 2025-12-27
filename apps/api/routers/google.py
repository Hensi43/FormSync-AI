
from fastapi import APIRouter, HTTPException, Request
from core.google_auth import google_auth
from pydantic import BaseModel

router = APIRouter()

class AuthUrlResponse(BaseModel):
    url: str

class TokenResponse(BaseModel):
    message: str

@router.get("/auth/url", response_model=AuthUrlResponse)
async def get_auth_url(request: Request):
    """
    Returns the Google OAuth authorization URL.
    The redirect_uri must match what is configured in Google Cloud Console.
    Construction: {protocol}://{host}:{port}/api/v1/google/auth/callback
    """
    # Dynamically build redirect_uri based on request or hardcode for dev
    # For local dev: http://localhost:8000/api/v1/google/auth/callback
    # Adjust based on your router prefix in main.py. 
    # If this router is at /api/v1/google, then callback is /api/v1/google/auth/callback
    
    # We'll treat the 'origin' + path as the redirect uri
    # But usually we need to strictly match registered URIs.
    # Let's assume standard local dev port 8000 for now or take from env.
    redirect_uri = "http://localhost:8000/api/v1/google/auth/callback"
    
    try:
        url = google_auth.get_authorization_url(redirect_uri)
        return {"url": url}
    except FileNotFoundError as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/auth/callback")
async def auth_callback(code: str):
    """
    Callback endpoint that Google redirects to.
    """
    redirect_uri = "http://localhost:8000/api/v1/google/auth/callback"
    try:
        google_auth.fetch_token(code, redirect_uri)
        return {"message": "Successfully authenticated with Google! You can close this window."}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Authentication failed: {str(e)}")

@router.get("/status")
async def get_status():
    creds = google_auth.get_credentials()
    return {"authenticated": creds is not None}
