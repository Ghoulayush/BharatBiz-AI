from fastapi import APIRouter
from app.models.database import db

router = APIRouter()

@router.get("/products")
def get_products():
    products_ref = db.collection("products")
    return [doc.to_dict() for doc in products_ref.stream()]
