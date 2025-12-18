from fastapi import APIRouter
from core.config import settings

router = APIRouter()

@router.get("/health")
def health_check():
    db_status = "unknown"
    try:
        from core.database import supabase
        # Lightweight check: get the user or just check if client exists
        # In a real scenario, we might query a table, but for now just initializing is enough check for the object
        if supabase:
            db_status = "initialized"
    except Exception as e:
        db_status = f"error: {str(e)}"

    return {
        "status": "active", 
        "version": settings.VERSION,
        "env": "development",
        "database": db_status
    }

@router.get("/")
def root():
    return {"message": "Welcome to FormSync AI API"}
