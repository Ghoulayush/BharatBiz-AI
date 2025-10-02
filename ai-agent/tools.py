# ai-agent/tools.py
"""
Tool definitions for the BharatBiz AI Agent.
"""

import re
from langchain.tools import Tool
from langchain.tools.retriever import create_retriever_tool
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_pinecone import PineconeVectorStore

# --- Tool 1: EMI Calculator ---
def emi_tool(query: str) -> str:
    """A robust EMI calculator that cleans its inputs."""
    print(f"Tool 'EMICalculator' received query: {query}")
    try:
        matches = re.findall(r'(\w+)\s*=\s*([\d,.-]+)', query)
        parts = {key: value for key, value in matches}
        clean_p = re.sub(r'[^\d.]', '', parts['P'])
        clean_r = re.sub(r'[^\d.]', '', parts['r'])
        clean_n = re.sub(r'[^\d.]', '', parts['n'])
        P = float(clean_p)
        r = float(clean_r)
        n = int(float(clean_n))
        monthly_r = r / 100 / 12
        emi = (P * monthly_r * (1 + monthly_r)**n) / ((1 + monthly_r)**n - 1)
        total_payable = emi * n
        total_interest = total_payable - P
        return (f"EMI Calculation Result:\n- Monthly EMI: ₹{emi:,.2f}\n- Principal Amount: ₹{P:,.0f}\n"
                f"- Interest Rate: {r}% per annum\n- Loan Tenure: {n} months\n"
                f"- Total Amount Payable: ₹{total_payable:,.2f}\n- Total Interest: ₹{total_interest:,.2f}")
    except Exception as e:
        return f"Error: Could not parse query. Please provide P, r, and n values. Details: {e}"

emi_calculator_tool = Tool(
    name="EMICalculator",
    func=emi_tool,
    description="Use to calculate loan EMIs. Input must be a string with P=<principal>, r=<annual interest rate>, and n=<number of months>."
)

# --- Tool 2: Scheme Search (RAG) ---
index_name = "bharatbiz-agent"
embeddings = HuggingFaceEmbeddings(model_name="BAAI/bge-small-en-v1.5")
vectorstore = PineconeVectorStore(index_name=index_name, embedding=embeddings)
retriever = vectorstore.as_retriever(search_kwargs={'k': 2}) # Retrieve top 2 results for more context

scheme_search_tool = create_retriever_tool(
    retriever,
    "BharatBizSchemeSearch",
    "Use to search for information on Indian government schemes for small businesses, startups, and MSMEs."
)

# --- Tool 3: Inventory Management Advice ---
def inventory_management_tool(query: str) -> str:
    """Provides general advice on how to manage low stock."""
    return """When stock is running low, here's what you should do:

Immediate Actions:
1. Review sales velocity - How fast is this product selling?
2. Check current demand - Are orders increasing?
3. Contact your supplier immediately for reorder and get an estimated delivery timeline.

Reordering Strategy:
- For fast-moving items, order immediately, possibly with express delivery.
- For seasonal items, consider demand forecasts before ordering.
- If your primary supplier has delays, look for alternative suppliers.

Prevent Future Stockouts:
- Set reorder points (e.g., when stock reaches 20 units, place a new order).
- Track sales patterns weekly to anticipate demand.
- Maintain a buffer or safety stock for your bestsellers.
"""

inventory_tool = Tool(
    name="InventoryManagement",
    func=inventory_management_tool,
    description="Use to get general advice on inventory management strategies, especially for low stock situations."
)