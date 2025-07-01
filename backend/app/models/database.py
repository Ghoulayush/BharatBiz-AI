# from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
# from sqlalchemy.orm import sessionmaker
# from app.models.db_models import Base

# DATABASE_URL = "sqlite+aiosqlite:///./bharatbiz.db"

# engine = create_async_engine(DATABASE_URL, echo=True)
# async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

# async def init_db():
#     async with engine.begin() as conn:
#         await conn.run_sync(Base.metadata.create_all)

from app.models.db_models import Customer, Product
from sqlalchemy import select

async def insert_sample_data():
    async with async_session() as session:
        # Check if products already exist
        result = await session.execute(select(Product))
        products_exist = result.scalars().first()
        if products_exist:
            return  # Don't insert again

        # Sample customers
        customers = [
            Customer(name="Ravi Kumar", language="Hindi"),
            Customer(name="Anjali Shah", language="English"),
        ]

        # Sample products
        products = [
            Product(name="Basmati Rice", category="Grocery", quantity=50),
            Product(name="Fortune Oil", category="Grocery", quantity=30),
            Product(name="Diwali Sweets", category="Festival", quantity=100),
        ]

        session.add_all(customers + products)
        await session.commit()
