from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from core.database import supabase
from typing import Dict, Any, Optional, List

router = APIRouter()

class FormCreate(BaseModel):
    title: str
    description: Optional[str] = None
    schema_body: Dict[str, Any]

@router.post("/")
def create_form(form: FormCreate, x_user_id: str = Header(None, alias="X-User-ID")):
    try:
        if not x_user_id:
             raise HTTPException(status_code=401, detail="Unauthorized: Missing User ID")

        # Prepare data for insertion
        data = {
            "title": form.title,
            "description": form.description,
            "schema": form.schema_body,
            "is_published": True,
            "user_id": x_user_id # Associate with user
        }
        
        # Insert into Supabase
        response = supabase.table("forms").insert(data).execute()
        
        return response.data[0]
    except Exception as e:
        print(f"Error saving form: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
def get_forms(x_user_id: str = Header(None, alias="X-User-ID")):
    try:
        if not x_user_id:
             raise HTTPException(status_code=401, detail="Unauthorized: Missing User ID")

        # Filter by user_id
        response = supabase.table("forms").select("*").eq("user_id", x_user_id).order("created_at", desc=True).limit(20).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{form_id}")
def get_form(form_id: str):
    try:
        # Public forms can be viewed by anyone for now (survey takers), 
        # OR we can restrict editing to owner.
        # For simplicity: GET by ID is public (needed for the public filling page).
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
        res = supabase.table("responses").insert(data).execute()
        return {"status": "success", "id": res.data[0].get("id")}
    except Exception as e:
        print(f"Error submitting response: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{form_id}/responses")
def get_form_responses(form_id: str, x_user_id: str = Header(None, alias="X-User-ID")):
    try:
        if not x_user_id:
             raise HTTPException(status_code=401, detail="Unauthorized: Missing User ID")

        # verifying ownership
        form_check = supabase.table("forms").select("user_id").eq("id", form_id).execute()
        if not form_check.data:
             raise HTTPException(status_code=404, detail="Form not found")
        
        # If user doesn't own the form, deny access
        # NOTE: If user_id column is missing in DB (legacy forms), this check might be tricky.
        # We assume new forms have it. Old forms (null user_id) might be viewable or not.
        owner_id = form_check.data[0].get("user_id")
        if owner_id and owner_id != x_user_id:
             raise HTTPException(status_code=403, detail="Forbidden: You do not own this form")

        response = supabase.table("responses").select("*").eq("form_id", form_id).order("created_at", desc=True).execute()
        return response.data
    except Exception as e:
        if "relation \"responses\" does not exist" in str(e):
             return []
        print(f"Error fetching responses: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{form_id}")
def delete_form(form_id: str, x_user_id: str = Header(None, alias="X-User-ID")):
    try:
        if not x_user_id:
             raise HTTPException(status_code=401, detail="Unauthorized: Missing User ID")

        # Verify ownership before delete
        # We can just chain .eq("user_id", x_user_id) to the delete query for safety
        
        # First delete responses
        try:
             # Ideally we check ownership first, but cascading delete based on form_id is safe 
             # IF the form delete is strictly scoped to user_id.
             pass 
        except:
             pass 

        # Delete form strictly belonging to user
        response = supabase.table("forms").delete().eq("id", form_id).eq("user_id", x_user_id).execute()
        
        if not response.data:
             # If nothing deleted, either didn't exist OR user didn't own it.
             # We can check explicitly if we want better error messages.
             return {"message": "Form deleted (or not found/authorized)"}

        # If form deleted, try to cleanup responses (orphaned responses)
        try:
            supabase.table("responses").delete().eq("form_id", form_id).execute()
        except:
            pass

        return {"status": "success", "deleted_id": form_id}
    except Exception as e:
        print(f"Error deleting form: {e}")
        raise HTTPException(status_code=500, detail=str(e))
