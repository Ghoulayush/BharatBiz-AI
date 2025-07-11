import os
import firebase_admin
from firebase_admin import credentials, auth
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Initialize Firebase Admin SDK
firebase_key_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "firebase_key.json"))
cred = credentials.Certificate(firebase_key_path)

if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

FIREBASE_WEB_API_KEY = os.getenv("FIREBASE_WEB_API_KEY")  # used in login endpoint
