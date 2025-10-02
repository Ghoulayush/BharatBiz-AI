# ai-agent/agent_core.py
import os
import re
import time
import logging
from dotenv import load_dotenv
from langchain import hub
from langchain.agents import AgentExecutor, create_react_agent
from langchain.tools.retriever import create_retriever_tool
from langchain_cerebras.chat_models import ChatCerebras
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_pinecone import PineconeVectorStore
from langchain.tools import Tool
from pinecone import Pinecone

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ---------------- LOAD ENV ----------------
load_dotenv()

# ---------------- TOOLS ----------------
def emi_tool(query: str) -> str:
    """Simple EMI calculator tool"""
    logger.info(f"Tool 'EMICalculator' received query: {query}")
    try:
        matches = re.findall(r'(\w+)\s*=\s*([\d,.]+)', query)
        parts = {key: value for key, value in matches}
        P = float(parts['P'].replace(',', ''))
        r = float(parts['r'].replace(',', ''))
        n = int(parts['n'].replace(',', ''))
        monthly_r = r / 100 / 12
        emi = (P * monthly_r * (1 + monthly_r) ** n) / ((1 + monthly_r) ** n - 1)
        return f"The calculated EMI is ₹{emi:,.2f} per month."
    except Exception as e:
        logger.error(f"EMI calculation error: {str(e)}")
        return f"Error: Could not parse query. Ensure P, r, and n are provided. Details: {e}"

emi_calculator_tool = Tool(
    name="EMICalculator",
    func=emi_tool,
    description="Use for calculating loan EMIs. Input must be a string with P=<principal>, r=<annual interest rate>, and n=<number of months>."
)

# ---------------- PINECONE ----------------
# Pinecone configuration
INDEX_NAME = "bharatbiz-schemes"
INDEX_HOST = "https://bharatbiz-schemes-npppmy9.svc.aped-4627-b74a.pinecone.io"

def init_pinecone_and_vectorstore():
    """Initialize Pinecone and vector store with retry logic"""
    try:
        logger.info("Initializing Pinecone connection...")
        api_key = os.getenv("PINECONE_API_KEY")
        if not api_key:
            raise ValueError("PINECONE_API_KEY environment variable is not set")

        # Initialize Pinecone client
        pc = Pinecone(api_key=api_key)
        logger.info("Pinecone client initialized")

        # Connect to existing index
        index = pc.Index(INDEX_NAME)
        logger.info(f"Successfully connected to index: {INDEX_NAME}")

        # Test connection
        try:
            stats = index.describe_index_stats()
            logger.info(f"Index stats: {stats}")
        except Exception as e:
            logger.error(f"Failed to get index stats: {str(e)}")
            raise

        # Initialize embeddings
        logger.info("Initializing embeddings...")
        embeddings = HuggingFaceEmbeddings(
            model_name="BAAI/bge-small-en-v1.5",
            model_kwargs={'device': 'cpu'}
        )
        logger.info("Embeddings initialized")

        # Initialize vector store
        logger.info("Initializing vector store...")
        vectorstore = PineconeVectorStore(
            index=index,
            embedding=embeddings,
            text_key="text",
            namespace=""
        )
        logger.info("Vector store initialized")
        return vectorstore, index

    except Exception as e:
        logger.error(f"Pinecone/Vectorstore initialization failed: {str(e)}")
        raise

# Initialize components
try:
    vectorstore, index = init_pinecone_and_vectorstore()
    
    def safe_retrieve(query: str) -> str:
        """Safe retrieval function with automatic retry"""
        try:
            retriever = vectorstore.as_retriever(
                search_kwargs={'k': 1},
                search_type="similarity"
            )
            response = retriever.invoke(query)
            if not response:
                return "No relevant information found in BharatBiz schemes database."
            return "\n".join(doc.page_content for doc in response)
        except Exception as e:
            logger.error(f"Retrieval error: {str(e)}")
            return "Error searching for information. Please try again."

    # Create the retrieval tool
    retrieval_tool = Tool(
        name="BharatBizSchemeSearch",
        func=safe_retrieve,
        description="Use to search for info on Indian government schemes for small businesses. Query it with the scheme name or a user's question about them."
    )

    # Create tools list
    tools = [emi_calculator_tool, retrieval_tool]

except Exception as e:
    logger.error(f"Failed to initialize tools: {str(e)}")
    raise

# ---------------- LLM ----------------
cerebras_api_key = os.getenv("CEREBRAS_API_KEY")
if not cerebras_api_key:
    raise ValueError("CEREBRAS_API_KEY environment variable is not set")

model_name = os.getenv("CEREBRAS_MODEL")
if not model_name:
    raise ValueError("CEREBRAS_MODEL environment variable is not set")

# Configure LLM with optimized settings
llm = ChatCerebras(
    model=model_name,
    temperature=0.0,
    cerebras_api_key=cerebras_api_key,
    max_tokens=500,
    timeout=20
)

# ---------------- AGENT CONFIGURATION ----------------
prompt = hub.pull("hwchase17/react-chat")

# Optimize prompt for faster responses
prompt.template = """
You are a focused assistant for BharatBiz that provides quick, direct answers. You have these tools:

{tools}

Use this strict format:

Question: the input question
Thought: brief reasoning (1 sentence)
Action: one of [{tool_names}]
Action Input: the input to the action
Observation: result of the action
Thought: analyze if the observation fully answers the question (1 sentence)
Final Answer: if observation is sufficient, provide complete answer based on the observation

Rules:
1. Keep thoughts brief and focused
2. Never retry the same tool if you already have a valid result
3. After getting a valid tool result, proceed directly to Final Answer
4. If tool fails or returns no data, explain the situation in Final Answer
5. Always include "Final Answer:" in your response
6. Stop after providing a Final Answer - do not make more tool calls

Previous conversation: No previous conversation.

New input: {input}
"""

def init_agent():
    """Initialize the agent with optimized settings"""
    try:
        logger.info("Creating ReAct agent...")
        agent = create_react_agent(llm, tools, prompt)
        
        logger.info("Initializing AgentExecutor...")
        executor = AgentExecutor(
            agent=agent,
            tools=tools,
            verbose=True,
            max_iterations=2,
            max_execution_time=20,
            early_stopping_method="force",
            return_intermediate_steps=True,
            handle_parsing_errors=True,
            handle_tool_errors=True
        )
        logger.info("Agent initialization complete")
        return executor
    except Exception as e:
        logger.error(f"Failed to initialize agent: {str(e)}")
        raise

# Create the agent executor
agent_executor = init_agent()