from app.models.database import db

def insert_sample_data():
    products_ref = db.collection("products")
    existing = [doc.to_dict() for doc in products_ref.stream()]
    if existing:
        print("🚫 Sample data already exists. Skipping insert.")
        return

    print("✅ Inserting sample data...")

    # Insert logic
    customers = [
        {"name": "Ravi Kumar", "language": "Hindi"},
        {"name": "Anjali Shah", "language": "English"}
    ]
    for customer in customers:
        db.collection("customers").add(customer)

    products = [
        {"name": "Basmati Rice", "category": "Grocery", "quantity": 50},
        {"name": "Fortune Oil", "category": "Grocery", "quantity": 30}
    ]
    for product in products:
        products_ref.add(product)
