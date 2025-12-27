
import os
import json
from google_auth_oauthlib.flow import Flow
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from googleapiclient.discovery import build

# If modifying these scopes, delete the file token.json.
SCOPES = [
    "https://www.googleapis.com/auth/forms.body",
    "https://www.googleapis.com/auth/drive.file"
]

CREDENTIALS_FILE = "credentials.json"
TOKEN_FILE = "token.json"

class GoogleAuth:
    def __init__(self):
        pass

    def _get_flow(self, redirect_uri):
        if not os.path.exists(CREDENTIALS_FILE):
             raise FileNotFoundError(f"Missing {CREDENTIALS_FILE}. Please setup Google Cloud Project.")
        
        return Flow.from_client_secrets_file(
            CREDENTIALS_FILE,
            scopes=SCOPES,
            redirect_uri=redirect_uri
        )

    def get_authorization_url(self, redirect_uri: str):
        """
        Creates a flow instance and returns the authorization URL.
        """
        flow = self._get_flow(redirect_uri)
        # Tell the user to go to the authorization URL.
        auth_url, _ = flow.authorization_url(prompt='consent')
        return auth_url

    def fetch_token(self, code: str, redirect_uri: str):
        """
        Exchanges the authorization code for a token and saves it.
        """
        flow = self._get_flow(redirect_uri)
        flow.fetch_token(code=code)
        creds = flow.credentials
        self.save_credentials(creds)
        return creds

    def get_credentials(self):
        """
        Returns valid credentials, refreshing them if necessary.
        """
        creds = None
        if os.path.exists(TOKEN_FILE):
            creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
        
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                try:
                    creds.refresh(Request())
                    self.save_credentials(creds)
                except Exception:
                    # Token invalid or unable to refresh
                    return None
            else:
                return None # return None to indicate re-auth needed
        
        return creds

    def save_credentials(self, creds):
        with open(TOKEN_FILE, 'w') as token:
            token.write(creds.to_json())

    def get_service(self, service_name, version):
        creds = self.get_credentials()
        if not creds:
            raise Exception("No valid credentials found. Please authenticate.")
        return build(service_name, version, credentials=creds)

google_auth = GoogleAuth()
