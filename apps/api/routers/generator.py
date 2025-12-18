from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.llm import generate_form_schema

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
