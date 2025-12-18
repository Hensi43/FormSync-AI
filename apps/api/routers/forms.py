from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from core.database import supabase
from typing import Dict, Any, Optional

router = APIRouter()

class FormCreate(BaseModel):
    title: str
    description: Optional[str] = None
    schema_body: Dict[str, Any]

@router.post("/")
def create_form(form: FormCreate):
    try:
        # Prepare data for insertion
        data = {
            "title": form.title,
            "description": form.description,
            "schema": form.schema_body,
            "is_published": True # Default to public for now for simplicity
        }
        
        # Insert into Supabase
        response = supabase.table("forms").insert(data).execute()
        
        return response.data[0]
    except Exception as e:
        print(f"Error saving form: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
def get_forms():
    try:
        response = supabase.table("forms").select("*").order("created_at", desc=True).limit(10).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
