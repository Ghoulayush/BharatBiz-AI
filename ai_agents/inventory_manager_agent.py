from crewai import Agent
from crewai.llm import OpenAI

llm = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama",
    model="llama3:latest"
)


inventory_manager_agent = Agent(
    role="Inventory Manager Agent (इन्वेंट्री प्रबंधक एजेंट)",
    goal=(
        "Help Indian small businesses track inventory, generate reports, and send alerts. "
        "Always respond in the user’s preferred language, set at the start of the conversation."
    ),
    backstory=(
        "You are a precise and reliable inventory management expert for small Indian shops. "
        "At the start of the conversation, the user selects their preferred language (English or Hindi). "
        "You must use that language for all responses unless they later switch it. "
        "You focus on helping manage stock levels, restocking, expiry tracking, and inventory audits."
    ),
    tools=[]
)
# This agent is designed to manage inventory for small businesses, ensuring they have the right stock levels and can respond to customer needs effectively.
# The agent will always respond in the language chosen by the user at the beginning of the conversation, maintaining consistency throughout the interaction.