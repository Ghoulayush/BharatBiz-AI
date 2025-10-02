"""
Test script for BharatBiz AI Agent
"""

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import tools
from tools import emi_calculator_tool, scheme_search_tool, inventory_tool

# Import agent configuration
from agent_config import create_agent_executor, create_role_specific_agent


def test_customer_support_role():
    """Test 1: Customer Support Specialist Role"""
    print("\n" + "="*50)
    print("--- Test 1: Customer Support Specialist Role ---")
    print("="*50 + "\n")
    
    tools = [scheme_search_tool]
    agent = create_role_specific_agent("Customer Support", tools, verbose=True)
    
    query = "Namaste, can you tell me about the Stand-Up India Scheme?"
    
    try:
        result = agent.invoke({"input": query})
        print("\n" + "="*50)
        print(f"Final Answer: {result['output']}")
        print("="*50 + "\n")
    except Exception as e:
        print(f"Error: {e}\n")


def test_business_coordinator_role():
    """Test 2: Business Coordination Specialist Role"""
    print("\n" + "="*50)
    print("--- Test 2: Business Coordinator Role ---")
    print("="*50 + "\n")
    
    tools = [emi_calculator_tool, scheme_search_tool]
    agent = create_role_specific_agent("Business Coordinator", tools, verbose=True)
    
    query = "I need to calculate an EMI for a business loan. P=250000, r=9.5, n=48"
    
    try:
        result = agent.invoke({"input": query})
        print("\n" + "="*50)
        print(f"Final Answer: {result['output']}")
        print("="*50 + "\n")
    except Exception as e:
        print(f"Error: {e}\n")


def test_inventory_manager_role():
    """Test 3: Inventory Management Specialist Role"""
    print("\n" + "="*50)
    print("--- Test 3: Inventory Manager Role ---")
    print("="*50 + "\n")
    
    tools = [inventory_tool]
    agent = create_role_specific_agent("Inventory Manager", tools, verbose=True)
    
    query = "What should I do if my stock of 'Product A' is low?"
    
    try:
        result = agent.invoke({"input": query})
        print("\n" + "="*50)
        print(f"Final Answer: {result['output']}")
        print("="*50 + "\n")
    except Exception as e:
        print(f"Error: {e}\n")


def test_multi_tool_agent():
    """Test 4: Agent with all tools"""
    print("\n" + "="*50)
    print("--- Test 4: Multi-Tool Agent ---")
    print("="*50 + "\n")
    
    all_tools = [scheme_search_tool, emi_calculator_tool, inventory_tool]
    agent = create_agent_executor(all_tools, verbose=True)
    
    test_queries = [
        "Tell me about MUDRA loans",
        "Calculate EMI for P=100000, r=8, n=24",
        "How do I manage low stock?",
    ]
    
    for query in test_queries:
        print(f"\n{'='*50}")
        print(f"Query: {query}")
        print(f"{'='*50}\n")
        
        try:
            result = agent.invoke({"input": query})
            print(f"\nFinal Answer: {result['output']}\n")
        except Exception as e:
            print(f"Error: {e}\n")


if __name__ == "__main__":
    print("\nStarting BharatBiz AI Agent Tests\n")
    
    # Run all tests
    test_customer_support_role()
    test_business_coordinator_role()
    test_inventory_manager_role()
    test_multi_tool_agent()
    
    print("\nAll tests completed!\n")