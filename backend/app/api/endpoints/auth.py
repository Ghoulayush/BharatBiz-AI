from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import firebase_admin
from firebase_admin import credentials, auth
import requests
import os
import json

router = APIRouter()

# Load credentials
firebase_key_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "firebase_key.json"))
if not firebase_admin._apps:
    cred = credentials.Certificate(firebase_key_path)
    firebase_admin.initialize_app(cred)

# 🔥 Get Web API Key from .env
from dotenv import load_dotenv
load_dotenv()
FIREBASE_WEB_API_KEY = os.getenv("FIREBASE_WEB_API_KEY")

class User(BaseModel):
    email: str
    password: str

@router.post("/signup")
def signup(user: User):
    try:
        user_record = auth.create_user(
            email=user.email,
            password=user.password
        )
        return {"message": "Signup successful", "uid": user_record.uid}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Signup failed: {str(e)}")

@router.post("/login")
def login(user: User):
    try:
        url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={FIREBASE_WEB_API_KEY}"
        payload = {
            "email": user.email,
            "password": user.password,
            "returnSecureToken": True
        }
        headers = {"Content-Type": "application/json"}

        res = requests.post(url, data=json.dumps(payload), headers=headers)
        res_data = res.json()

        if "idToken" in res_data:
            return {"message": "Login successful", "token": res_data["idToken"]}
        else:
            raise HTTPException(status_code=401, detail="Login failed: " + res_data.get("error", {}).get("message", "Unknown error"))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
