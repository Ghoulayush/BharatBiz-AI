# mcp_servers/inventory_tool/server.py
import sys
import os
from pathlib import Path
from fastapi import FastAPI, Request, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Add the ai-agent directory to Python path
ai_agent_path = str(Path(__file__).parent.parent.parent / 'ai-agent')
sys.path.append(ai_agent_path)

# Initialize agent_executor as None, we'll create it on first request
agent_executor = None

import logging
logger = logging.getLogger(__name__)

async def get_agent():
    """Get or initialize the AI agent with proper error handling."""
    global agent_executor
    
    if agent_executor is None:
        logger.info("Initializing new agent...")
        try:
            from dotenv import load_dotenv
            load_dotenv()
            
            # Import agent_executor after loading environment variables
            from agent_core import agent_executor as new_agent
            agent_executor = new_agent
            logger.info("Agent initialized successfully")
            
        except Exception as e:
            logger.error(f"Error initializing agent: {str(e)}")
            raise ValueError(f"Failed to initialize AI agent: {str(e)}")
    
    return agent_executor

app = FastAPI()

# Add CORS middleware before any routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8082", "http://localhost:5173", "http://localhost:3000"],  # Add your Vite dev server
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=600,  # Cache preflight requests for 10 minutes
)

class ChatRequest(BaseModel):
    text: str
    chat_history: list = []  # List of previous messages

class ChatResponse(BaseModel):
    response: str
    context: dict = {}

from fastapi.background import BackgroundTasks
import asyncio

@app.post("/api/chat")
async def chat(chat_request: ChatRequest):
    """Handle chat requests using AI agent."""
    try:
        logger.info(f"Received chat request: {chat_request.text}")
        logger.debug(f"Chat history length: {len(chat_request.chat_history)}")
        
        # Get or initialize the agent
        agent = await get_agent()
        
        # Format chat history
        chat_history = ""
        if chat_request.chat_history:
            chat_history = "\n".join([
                f"Human: {msg['human']}\nAssistant: {msg['ai']}\n" 
                for msg in chat_request.chat_history
            ])
            
        # Process the message through the AI agent
        print("Processing through AI agent...")
        try:
            logger.info("Invoking agent...")
            # Use a shorter timeout aligned with agent configuration
            result = await asyncio.wait_for(
                asyncio.get_event_loop().run_in_executor(
                    None, 
                    lambda: agent.invoke({
                        "input": chat_request.text,
                        "chat_history": chat_history
                    })
                ),
                timeout=30  # Align with agent's max_execution_time
            )
            logger.debug(f"Agent result: {result}")
            
            # Log agent performance metrics
            if result.get("intermediate_steps"):
                logger.info(f"Agent used {len(result['intermediate_steps'])} steps")
                for idx, step in enumerate(result['intermediate_steps']):
                    if isinstance(step, tuple) and len(step) >= 2:
                        logger.debug(f"Step {idx + 1}: Action - {step[0]}, Result - {step[1]}")
                    else:
                        logger.debug(f"Step {idx + 1}: {step}")

                        # Process results
            if not result.get("output"):
                partial_response = "I started working on your request but couldn't complete it. Here's what I found:\n\n"
                steps = result.get("intermediate_steps", [])
                for step in steps:
                    if isinstance(step, tuple) and len(step) >= 2:
                        partial_response += f"- Action: {step[0].tool}\n  Result: {step[1]}\n"
                return ChatResponse(
                    response=partial_response + "\nPlease try asking a simpler question.",
                    context={"partial_result": True, "steps": steps}
                )
            
            # Return successful response
            return ChatResponse(
                response=result["output"],
                context={"thought_process": result.get("intermediate_steps", [])}
            )

        except asyncio.TimeoutError:
            return ChatResponse(
                response="I apologize, but your request took too long. Please try being more specific or asking one thing at a time.",
                context={"error": "timeout", "limit": "30 seconds"}
            )
            
    except Exception as e:
        import traceback
        error_traceback = traceback.format_exc()
        logger.error(f"Error in chat endpoint: {str(e)}")
        logger.error(f"Traceback:\n{error_traceback}")
        
        error_msg = str(e).lower()
        if "iteration limit" in error_msg:
            msg = "I used too many steps trying to answer. Please try a simpler question."
        elif "time limit" in error_msg:
            msg = "Your request took too long. Please be more specific."
        else:
            msg = "I ran into an unexpected error. Please try rephrasing your question."
            
        return ChatResponse(
            response=msg,
            context={"error": str(e)}
        )

@app.get("/")
async def root():
    return {"message": "Hello from BharatBiz AI Agent"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)