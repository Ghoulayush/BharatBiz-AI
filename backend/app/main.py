from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.models.sample_data import insert_sample_data
from app.api.endpoints import products

app = FastAPI()

# Allow frontend to access backend (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.on_event("startup")
async def startup_event():
    insert_sample_data()

@app.get("/")
def root():
    return {"message": "BharatBiz AI Backend with Firebase 🔥"}

# Add product API routes
app.include_router(products.router)
