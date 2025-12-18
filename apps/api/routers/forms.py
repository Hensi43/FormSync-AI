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

@router.get("/{form_id}")
def get_form(form_id: str):
    try:
        response = supabase.table("forms").select("*").eq("id", form_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Form not found")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class FormResponse(BaseModel):
    data: Dict[str, Any]

@router.post("/{form_id}/submit")
def submit_form_response(form_id: str, response_data: FormResponse):
    try:
        # Check if form exists
        form_res = supabase.table("forms").select("id").eq("id", form_id).execute()
        if not form_res.data:
            raise HTTPException(status_code=404, detail="Form not found")

        data = {
            "form_id": form_id,
            "response_data": response_data.data
        }
        
        # Insert response
        # NOTE: Assumes a "responses" table exists with form_id (uuid) and response_data (jsonb)
        res = supabase.table("responses").insert(data).execute()
        return {"status": "success", "id": res.data[0].get("id")}
    except Exception as e:
        print(f"Error submitting response: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{form_id}/responses")
def get_form_responses(form_id: str):
    try:
        response = supabase.table("responses").select("*").eq("form_id", form_id).order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        # If the table doesn't exist yet, return empty list gracefully
        if "relation \"responses\" does not exist" in str(e):
             return []
        print(f"Error fetching responses: {e}")
        raise HTTPException(status_code=500, detail=str(e))
