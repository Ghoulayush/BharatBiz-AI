"""
Government Scheme Search Tool for BharatBiz AI
"""

from langchain.tools import Tool
import os


def create_scheme_search_tool():
    """
    Create the scheme search tool with fallback database.
    """
    # Fallback scheme database
    def fallback_handler(query: str) -> str:
        mock_schemes = {
            "mudra": "MUDRA Yojana provides loans up to ₹10 lakh to non-corporate, non-farm small/micro enterprises. Categories: Shishu (up to ₹50,000), Kishore (₹50,000-₹5 lakh), Tarun (₹5-10 lakh).",
            
            "stand-up india": "Stand-Up India Scheme facilitates bank loans between ₹10 lakh and ₹1 Crore to at least one SC/ST borrower and one woman borrower per bank branch for greenfield enterprises.",
            
            "pmegp": "PMEGP (Prime Minister's Employment Generation Programme) provides subsidies: 15-35% for general category, 25-35% for special categories. Maximum project cost: ₹25 lakh for manufacturing, ₹10 lakh for services.",
            
            "startup india": "Startup India provides tax exemptions for 3 years, easy compliance, IPR fast-tracking, and fund of funds support. Eligibility: Entity < 10 years old, turnover < ₹100 crore.",
            
            "msme": "MSME schemes include Credit Guarantee Scheme, Technology Upgradation, Market Development, and skill development programs. Classification based on investment and turnover.",
        }
        
        query_lower = query.lower()
        
        # Search for matching schemes
        found_schemes = []
        for key, value in mock_schemes.items():
            if key in query_lower or any(word in query_lower for word in key.split()):
                found_schemes.append(value)
        
        if found_schemes:
            return "\n\n".join(found_schemes)
        
        return """I can help you find information about these government schemes:
- MUDRA Yojana (micro loans)
- Stand-Up India (SC/ST and women entrepreneurs)
- PMEGP (manufacturing and service subsidies)
- Startup India (startup benefits)
- MSME schemes (various support programs)

Please ask about a specific scheme."""
    
    return Tool(
        name="BharatBizSchemeSearch",
        func=fallback_handler,
        description=(
            "Search for Indian government schemes, subsidies, and loans. "
            "Use ONLY for government scheme queries like MUDRA, Stand-Up India, PMEGP, Startup India."
        )
    )


# Create the tool instance
scheme_search_tool = create_scheme_search_tool()