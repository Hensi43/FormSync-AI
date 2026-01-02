from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.llm import generate_form_schema
from services.google_forms import google_forms_service

router = APIRouter()

class GenerateRequest(BaseModel):
    description: str

@router.post("/generate")
def generate_form(request: GenerateRequest):
    if not request.description:
        raise HTTPException(status_code=400, detail="Description is required")
    
    schema = generate_form_schema(request.description)
    
    if "error" in schema:
        raise HTTPException(status_code=500, detail=schema["details"])
        
    return schema

@router.post("/generate/google")
def generate_google_form(request: GenerateRequest):
    if not request.description:
        raise HTTPException(status_code=400, detail="Description is required")
    
    # 1. Generate Schema
    schema = generate_form_schema(request.description)
    
    if "error" in schema:
        raise HTTPException(status_code=500, detail=schema.get("details", "LLM generation failed"))

    # 2. Create Google Form
    try:
        result = google_forms_service.create_form(schema)
        
        # Support both old string return and new dict return for backward compat
        if isinstance(result, dict):
             return {"formUrl": result.get("responderUri"), "editUrl": result.get("editUrl"), "schema": schema}
        else:
             return {"formUrl": result, "schema": schema}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Google Forms creation failed: {str(e)}")
