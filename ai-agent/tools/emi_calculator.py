"""
EMI Calculator Tool for BharatBiz AI
Calculates monthly EMI for business loans
"""

import math
from langchain.tools import Tool


def calculate_emi(P: float, r: float, n: int) -> dict:
    """
    Calculate EMI using the formula:
    EMI = [P x r x (1+r)^n] / [(1+r)^n - 1]
    
    Args:
        P: Principal loan amount
        r: Annual interest rate (percentage)
        n: Loan tenure in months
    
    Returns:
        Dictionary with EMI details
    """
    # Convert annual rate to monthly rate
    monthly_rate = (r / 12) / 100
    
    # Calculate EMI
    if monthly_rate == 0:
        emi = P / n
    else:
        emi = (P * monthly_rate * math.pow(1 + monthly_rate, n)) / \
              (math.pow(1 + monthly_rate, n) - 1)
    
    total_amount = emi * n
    total_interest = total_amount - P
    
    return {
        'emi': round(emi, 2),
        'total_amount': round(total_amount, 2),
        'total_interest': round(total_interest, 2),
        'principal': P,
        'rate': r,
        'tenure': n
    }


def parse_emi_query(query: str) -> tuple:
    """
    Parse EMI calculator query from natural language or formatted input.
    Handles formats like: "P=250000, r=9.5, n=48" or "P=250000, r=9.5, n=48."
    """
    import re
    
    # Clean the query - remove trailing periods, extra spaces
    query = query.strip().rstrip('.,;')
    
    try:
        # Try to extract P, r, n using regex
        p_match = re.search(r'P\s*=\s*(\d+)', query, re.IGNORECASE)
        r_match = re.search(r'r\s*=\s*([\d.]+)', query, re.IGNORECASE)
        n_match = re.search(r'n\s*=\s*(\d+)', query, re.IGNORECASE)
        
        if not p_match or not r_match or not n_match:
            raise ValueError("Missing required parameters (P, r, n)")
        
        P = int(p_match.group(1))
        r = float(r_match.group(1))
        n = int(n_match.group(1))
        
        # Validate inputs
        if P <= 0:
            raise ValueError("Principal amount must be positive")
        if r < 0 or r > 100:
            raise ValueError("Interest rate must be between 0 and 100")
        if n <= 0:
            raise ValueError("Tenure must be positive")
        
        return P, r, n
        
    except ValueError as e:
        raise ValueError(f"Invalid input format: {e}")
    except Exception as e:
        raise ValueError(f"Could not parse query: {e}")


def emi_calculator_handler(query: str) -> str:
    """
    Main handler for EMI calculator tool.
    """
    try:
        # Parse the query
        P, r, n = parse_emi_query(query)
        
        # Calculate EMI
        result = calculate_emi(P, r, n)
        
        # Format response
        response = f"""EMI Calculation Result:
- Monthly EMI: ₹{result['emi']:,.2f}
- Principal Amount: ₹{result['principal']:,}
- Interest Rate: {result['rate']}% per annum
- Loan Tenure: {result['tenure']} months
- Total Amount Payable: ₹{result['total_amount']:,.2f}
- Total Interest: ₹{result['total_interest']:,.2f}"""
        
        return response.strip()
        
    except Exception as e:
        return f"Error calculating EMI: {str(e)}\n\nPlease provide input in format: P=250000, r=9.5, n=48"


# Create the LangChain Tool
emi_calculator_tool = Tool(
    name="EMICalculator",
    func=emi_calculator_handler,
    description=(
        "Calculate monthly EMI for business loans. "
        "Input format: P=<principal>, r=<annual_rate>, n=<months>. "
        "Example: P=250000, r=9.5, n=48. Use this ONLY for EMI calculations."
    )
)