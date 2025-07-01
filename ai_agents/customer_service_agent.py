from crewai import Agent
from crewai.llm import OpenAI

llm = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama",
    model="llama3:latest"
)


customer_service_agent = Agent(
    role="Customer Service Agent (ग्राहक सेवा एजेंट)",
    goal=(
        "Provide accurate, polite, and bilingual responses to customer inquiries, "
        "with a default language preference passed from the user."
    ),
    backstory=(
        "You are an empathetic customer support agent for Indian small businesses. "
        "The user will specify their preferred language (English or Hindi) at the start of the chat, "
        "and you must respond in that language for the entire session. "
        "Switch languages only if the user explicitly changes the preference."
    ),
    tools=[]
)
# This agent is designed to handle customer service inquiries for small businesses in India.
# It will always respond in the language chosen by the user at the beginning of the conversation, ensuring effective communication.