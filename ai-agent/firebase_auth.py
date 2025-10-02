import firebase_admin
from firebase_admin import credentials, auth
from functools import wraps
from fastapi import HTTPException, Request

# Initialize Firebase Admin SDK
cred = credentials.Certificate("path/to/your/serviceAccountKey.json")  # You'll need to add your service account key
firebase_admin.initialize_app(cred)

def verify_firebase_token(token: str):
    """Verify Firebase ID token."""
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

def firebase_auth_required():
    """Decorator for protected routes that require Firebase authentication."""
    def decorator(func):
        @wraps(func)
        async def wrapper(request: Request, *args, **kwargs):
            auth_header = request.headers.get("Authorization")
            if not auth_header or not auth_header.startswith("Bearer "):
                raise HTTPException(status_code=401, detail="No authentication token provided")
            
            token = auth_header.split(" ")[1]
            user_info = verify_firebase_token(token)
            
            # Add user info to request state
            request.state.user = user_info
            return await func(request, *args, **kwargs)
        return wrapper
    return decorator