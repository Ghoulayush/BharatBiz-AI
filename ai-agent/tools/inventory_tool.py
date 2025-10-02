"""
Inventory Management Tool for BharatBiz AI
"""

from langchain.tools import Tool


def inventory_management_handler(query: str) -> str:
    """
    Handle inventory management queries.
    """
    query_lower = query.lower()
    
    # Low stock scenarios
    if any(term in query_lower for term in ["low stock", "stock is low", "out of stock", "running low", "stock low"]):
        return """When stock is running low, here's what you should do:

Immediate Actions:
1. Review sales velocity - How fast is this product selling?
2. Check current demand - Are orders increasing?
3. Contact your supplier immediately for reorder
4. Get estimated delivery timeline

Reordering Strategy:
- If fast-moving: Order immediately with express delivery
- If seasonal: Consider demand forecasts
- If supplier delays: Look for alternative suppliers
- Maintain safety stock for popular items

Prevent Future Stockouts:
- Set reorder points (when stock reaches X units, reorder)
- Use Economic Order Quantity (EOQ) formula
- Track sales patterns weekly
- Maintain buffer stock for bestsellers

Customer Communication:
- Notify existing customers about limited stock
- Offer pre-orders if restocking soon
- Suggest alternative products"""
    
    # Reorder point calculations
    elif any(term in query_lower for term in ["reorder point", "when to reorder", "reorder level"]):
        return """Calculate Your Reorder Point:

Formula: Reorder Point = (Average Daily Sales × Lead Time) + Safety Stock

Example:
- Average daily sales: 10 units
- Supplier lead time: 7 days
- Safety stock: 20 units
- Reorder Point = (10 × 7) + 20 = 90 units

Reorder when stock reaches 90 units!

Tips:
- Increase safety stock for unpredictable items
- Review reorder points monthly
- Adjust for seasonal variations"""
    
    # General inventory advice
    else:
        return """I can help with inventory management! Ask me about:

- Low stock alerts and reordering
- Reorder point calculations
- Inventory tracking methods
- Safety stock requirements
- Best practices for small businesses

Please ask a specific question like:
- "What should I do if stock is low?"
- "How do I calculate reorder points?"
- "Best way to track inventory?" """


# Create the LangChain Tool
inventory_tool = Tool(
    name="InventoryManagement",
    func=inventory_management_handler,
    description=(
        "Provides inventory management advice, stock management strategies, and reordering guidance. "
        "Use this for: low stock, reorder points, inventory tracking, stock management. "
        "Do NOT use for government schemes or financial calculations."
    )
)