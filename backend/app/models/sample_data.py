from app.models.database import db

def insert_sample_data():
    customers_ref = db.collection("customers")
    products_ref = db.collection("products")

    # Customers
    customers = [
        {"name": "Ravi Kumar", "language": "Hindi"},
        {"name": "Anjali Shah", "language": "English"}
    ]
    for customer in customers:
        customers_ref.add(customer)

    # Products
    products = [
        {"name": "Basmati Rice", "category": "Grocery", "quantity": 50},
        {"name": "Fortune Oil", "category": "Grocery", "quantity": 30}
    ]
    for product in products:
        products_ref.add(product)
