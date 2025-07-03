from crewai import Agent, Crew, Process, Task,LLM
from crewai.project import CrewBase, agent, crew, task
from crewai.agents.agent_builder.base_agent import BaseAgent
from typing import List
# If you want to run a snippet of code before or after the crew starts,
# you can use the @before_kickoff and @after_kickoff decorators
# https://docs.crewai.com/concepts/crews#example-crew-class-with-decorators

@CrewBase
class BusinessCoordinator():
    """BusinessCoordinator crew"""

    agents: List[BaseAgent]
    tasks: List[Task]

    ollama_llm = LLM(
        model='ollama/llama3.1:8b',
        base_url='http://localhost:11434'
    )

    # Learn more about YAML configuration files here:
    # Agents: https://docs.crewai.com/concepts/agents#yaml-configuration-recommended
    # Tasks: https://docs.crewai.com/concepts/tasks#yaml-configuration-recommended
    
    # If you would like to add tools to your agents, you can learn more about it here:
    # https://docs.crewai.com/concepts/agents#agent-tools
    @agent
    def business_coordinator(self) -> Agent:
        return Agent(
            config=self.agents_config['business_coordinator'],  # type: ignore[index]
            llm=self.ollama_llm,
            verbose=True
        )

    @agent
    def sales_analyst(self) -> Agent:
        return Agent(
            config=self.agents_config['sales_analyst'],  # type: ignore[index]
            llm=self.ollama_llm,
            verbose=True
        )

    @agent
    def marketing_specialist(self) -> Agent:
        return Agent(
            config=self.agents_config['marketing_specialist'],  # type: ignore[index]
            llm=self.ollama_llm,
            verbose=True
        )

    @agent
    def operations_optimizer(self) -> Agent:
        return Agent(
            config=self.agents_config['operations_optimizer'],  # type: ignore[index]
            llm=self.ollama_llm,
            verbose=True
        )


    # To learn more about structured task outputs,
    # task dependencies, and task callbacks, check out the documentation:
    # https://docs.crewai.com/concepts/tasks#overview-of-a-task
    @task
    def coordinator_task(self) -> Task:
        return Task(
            config=self.tasks_config['coordinator_task'],  # type: ignore[index]
            output_file='report.md'
        )

    @task
    def sales_task(self) -> Task:
        return Task(
            config=self.tasks_config['sales_task'],  # type: ignore[index]
        )

    @task
    def marketing_task(self) -> Task:
        return Task(
            config=self.tasks_config['marketing_task'],  # type: ignore[index]
        )

    @task
    def operations_task(self) -> Task:
        return Task(
            config=self.tasks_config['operations_task'],  # type: ignore[index]
        )

    @crew
    def crew(self) -> Crew:
        """Creates the BusinessCoordinator crew"""
        # To learn how to add knowledge sources to your crew, check out the documentation:
        # https://docs.crewai.com/concepts/knowledge#what-is-knowledge

        return Crew(
            agents=self.agents, # Automatically created by the @agent decorator
            tasks=self.tasks, # Automatically created by the @task decorator
            process=Process.sequential,
            verbose=True,
            # process=Process.hierarchical, # In case you wanna use that instead https://docs.crewai.com/how-to/Hierarchical/
        )