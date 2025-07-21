#!/usr/bin/env python
import sys
import os
from dotenv import load_dotenv
from pydantic import SecretStr
from langchain_groq import ChatGroq
from bharatbiz_ai_multi_agent_system_for_indian_smes.crew import BharatbizAiMultiAgentSystemForIndianSmesCrew

# This main file is intended to be a way for your to run your
# crew locally, so refrain from adding unnecessary logic into this file.
# Replace with inputs you want to test with, it will automatically
# interpolate any tasks and agents information

load_dotenv()  # Load environment variables from .env

def run():
    """
    Run the crew.
    """
    groq_api_key = os.getenv("GROQ_API_KEY")
    if not groq_api_key:
        raise ValueError("GROQ_API_KEY not found in environment variables")

    inputs = {
        # Add your test inputs here
    }

    llm = ChatGroq(
        model="llama3-70b-8192",
        api_key=SecretStr(groq_api_key),  # Now groq_api_key is guaranteed to be str, not None
    )

    BharatbizAiMultiAgentSystemForIndianSmesCrew().crew().kickoff(inputs=inputs)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: main.py <command> [<args>]")
        sys.exit(1)

    command = sys.argv[1]
    if command == "run":
        run()
    else:
        print(f"Unknown command: {command}")
        sys.exit(1)
