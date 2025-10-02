"""
Agent Configuration for BharatBiz AI - Cerebras Compatible
"""

from langchain.agents import AgentExecutor, create_react_agent
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.agents import AgentOutputParser
from langchain.schema import AgentAction, AgentFinish
import os
import re


# Custom Output Parser to force Final Answer
class ForceFinalAnswerParser(AgentOutputParser):
    """Custom parser that forces a Final Answer after one tool use."""
    
    def __init__(self):
        self.tool_used = False
    
    def parse(self, text: str):
        # Check if we got an Observation (tool result)
        if "Observation:" in text or self.tool_used:
            # Force a Final Answer
            if "Final Answer:" in text:
                return AgentFinish(
                    return_values={"output": text.split("Final Answer:")[-1].strip()},
                    log=text,
                )
            else:
                # Extract the observation and create a Final Answer
                match = re.search(r"Observation:\s*(.*?)(?:\n|$)", text, re.DOTALL)
                if match:
                    observation = match.group(1).strip()
                    return AgentFinish(
                        return_values={"output": observation},
                        log=text,
                    )
        
        # Check for Action
        action_match = re.search(r"Action:\s*(.*?)(?:\n|$)", text)
        action_input_match = re.search(r"Action Input:\s*(.*?)(?:\n|$)", text, re.DOTALL)
        
        if action_match and action_input_match:
            self.tool_used = True
            return AgentAction(
                tool=action_match.group(1).strip(),
                tool_input=action_input_match.group(1).strip(),
                log=text,
            )
        
        # Check for Final Answer
        if "Final Answer:" in text:
            return AgentFinish(
                return_values={"output": text.split("Final Answer:")[-1].strip()},
                log=text,
            )
        
        # Default: return as text
        return AgentFinish(
            return_values={"output": text.strip()},
            log=text,
        )


# React Prompt Template
REACT_PROMPT_TEMPLATE = """Answer the following questions as best you can. You have access to the following tools:

{tools}

Use this format:

Question: the input question you must answer
Thought: think about what to do
Action: the action to take, one of [{tool_names}]
Action Input: the input to the action
Observation: the result of the action
Thought: I now know the final answer
Final Answer: the final answer

RULE: After ONE Observation, immediately provide Final Answer.

Begin!

Question: {input}
Thought:{agent_scratchpad}"""


def create_cerebras_llm(temperature=0.0):
    """Create Cerebras LLM using OpenAI-compatible interface."""
    return ChatOpenAI(
        model=os.getenv("CEREBRAS_MODEL", "llama3.1-8b"),
        temperature=temperature,
        openai_api_key=os.getenv("CEREBRAS_API_KEY"),
        openai_api_base="https://api.cerebras.ai/v1",
        max_tokens=1000,
    )


def create_agent_executor(tools, verbose=True):
    """Create and configure the agent executor."""
    llm = create_cerebras_llm()
    prompt = PromptTemplate.from_template(REACT_PROMPT_TEMPLATE)
    agent = create_react_agent(llm=llm, tools=tools, prompt=prompt)
    
    return AgentExecutor(
        agent=agent,
        tools=tools,
        verbose=verbose,
        max_iterations=1,  # Only allow ONE iteration
        max_execution_time=20,
        handle_parsing_errors=True,
        return_intermediate_steps=False,
    )


def create_role_specific_agent(role, tools, verbose=True):
    """Create an agent with role-specific instructions."""
    role_prompts = {
        "Customer Support": "\nYou are a Customer Support Specialist. After using a tool once, immediately provide your Final Answer.",
        "Business Coordinator": "\nYou are a Business Coordinator. After getting results, immediately provide your Final Answer.",
        "Inventory Manager": "\nYou are an Inventory Manager. After getting advice, immediately provide your Final Answer.",
    }
    
    role_instruction = role_prompts.get(role, "")
    custom_prompt = role_instruction + "\n\n" + REACT_PROMPT_TEMPLATE
    
    llm = create_cerebras_llm()
    prompt = PromptTemplate.from_template(custom_prompt)
    agent = create_react_agent(llm=llm, tools=tools, prompt=prompt)
    
    return AgentExecutor(
        agent=agent,
        tools=tools,
        verbose=verbose,
        max_iterations=1,  # Only allow ONE iteration
        max_execution_time=20,
        handle_parsing_errors=True,
    )