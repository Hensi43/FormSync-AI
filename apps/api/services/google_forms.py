
from core.google_auth import google_auth

class GoogleFormsService:
    def __init__(self):
        pass

    def create_form(self, schema: dict):
        """
        Creates a Google Form based on the provided JSON schema.
        """
        service = google_auth.get_service("forms", "v1")

        # 1. Create an empty form
        form_title = schema.get("title", "Untitled Form")
        initial_form = {
            "info": {
                "title": form_title,
                "documentTitle": form_title,
            }
        }
        form = service.forms().create(body=initial_form).execute()
        form_id = form["formId"]

        # 2. Batch update to add description and items
        requests = []
        
        # Add description
        if "description" in schema:
            requests.append({
                "updateFormInfo": {
                    "info": {
                        "description": schema["description"]
                    },
                    "updateMask": "description"
                }
            })

        # Add items (Questions)
        # Note: Index needs to be managed if we want specific order, but appending works.
        index = 0
        for field in schema.get("fields", []):
            item_request = self._create_item_request(field, index)
            if item_request:
                requests.append(item_request)
                index += 1

        if requests:
            service.forms().batchUpdate(formId=form_id, body={"requests": requests}).execute()

        # Return the responder URL
        # We need to fetch the form again to get the responderUri if it wasn't in the create response
        # The create response usually has responderUri.
        # Return both the responder URL and the Edit URL
        edit_url = f"https://docs.google.com/forms/d/{form_id}/edit"
        return {"responderUri": form.get("responderUri"), "editUrl": edit_url}

    def _create_item_request(self, field, index):
        """
        Helper to create a 'createItem' request for a single field or 'createItem' for standard questions.
        Google Forms API uses 'createItem' which contains a 'questionItem', 'groupItem', etc.
        """
        label = field.get("label", "Untitled Question")
        field_type = field.get("type", "text")
        
        # Base Question dictionary
        question = {
            "required": field.get("required", False)
        }

        # Determine specific question type (OneOf: textQuestion, choiceQuestion, etc.)
        if field_type == "textarea":
             question["textQuestion"] = {"paragraph": True}
        elif field_type in ["select", "radio"]:
            raw_options = field.get("options", [])
            if not raw_options:
                raw_options = ["Option 1"]
            options = [{"value": opt} for opt in raw_options]
            question["choiceQuestion"] = {
                "type": "RADIO",
                "options": options
            }
        elif field_type == "checkbox":
            raw_options = field.get("options", [])
            if not raw_options:
                raw_options = ["Option 1"]
            options = [{"value": opt} for opt in raw_options]
            question["choiceQuestion"] = {
                "type": "CHECKBOX",
                "options": options
            }
        elif field_type == "date":
             question["dateQuestion"] = {}
        elif field_type == "time":
             question["timeQuestion"] = {}
        else:
             # Default to short answer text
             question["textQuestion"] = {}
        
        # Construct the createItem request
        return {
            "createItem": {
                "item": {
                    "title": label,
                    "questionItem": {
                        "question": question
                    }
                },
                "location": {
                    "index": index
                }
            }
        }

google_forms_service = GoogleFormsService()
