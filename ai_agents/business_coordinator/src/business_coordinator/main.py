#!/usr/bin/env python
import sys
import warnings

from datetime import datetime

from crew import BusinessCoordinator

warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")

# This main file is intended to be a way for you to run your
# crew locally, so refrain from adding unnecessary logic into this file.
# Replace with inputs you want to test with, it will automatically
# interpolate any tasks and agents information

def run():
    """
    Run the crew.
    """
    inputs = {
        "topic": "Consumer Electronics Retail Business",
        "business_profile": {
            "name": "Acme Electronics",
            "industry": "Consumer Electronics",
            "monthly_revenue": "75000 USD",
            "customer_segments": "B2C retail",
            "top_products": ["Smartphones", "Laptops"],
            "current_challenges": ["Low repeat customers", "High marketing costs"],
            "recent_marketing": "Running Facebook Ads, influencer partnerships",
            "recent_sales_trends": "Summer sales spike, winter slowdown",
            "operational_issues": ["Supplier delays in Q4"],
        },
        "current_year": str(datetime.now().year)
    }
    
    try:
       BusinessCoordinator().crew().kickoff(inputs=inputs)
    except Exception as e:
        raise Exception(f"An error occurred while running the crew: {e}")

run()