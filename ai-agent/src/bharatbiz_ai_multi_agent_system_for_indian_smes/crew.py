from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai_tools import SerperDevTool

@CrewBase
class BharatbizAiMultiAgentSystemForIndianSmesCrew():
    """BharatbizAiMultiAgentSystemForIndianSmes crew"""

    @agent
    def customer_support_specialist(self) -> Agent:
        return Agent(
            config=self.agents_config['customer_support_specialist'],
            tools=[SerperDevTool()],
        )

    @agent
    def business_coordinator(self) -> Agent:
        return Agent(
            config=self.agents_config['business_coordinator'],
            tools=[SerperDevTool()],
        )

    @agent
    def inventory_manager(self) -> Agent:
        return Agent(
            config=self.agents_config['inventory_manager'],
            tools=[SerperDevTool()],
        )


    @task
    def bilingual_customer_support(self) -> Task:
        return Task(
            config=self.tasks_config['bilingual_customer_support'],
            tools=[SerperDevTool()],
        )

    @task
    def business_operations_coordination(self) -> Task:
        return Task(
            config=self.tasks_config['business_operations_coordination'],
            tools=[SerperDevTool()],
        )

    @task
    def inventory_monitoring_and_alerts(self) -> Task:
        return Task(
            config=self.tasks_config['inventory_monitoring_and_alerts'],
            tools=[SerperDevTool()],
        )


    @crew
    def crew(self) -> Crew:
        """Creates the BharatbizAiMultiAgentSystemForIndianSmes crew"""
        return Crew(
            agents=self.agents, # Automatically created by the @agent decorator
            tasks=self.tasks, # Automatically created by the @task decorator
            process=Process.sequential,
            verbose=True,
        )
