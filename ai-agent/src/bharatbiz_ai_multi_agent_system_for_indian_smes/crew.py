from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai_tools import SerperDevTool

@CrewBase
class BharatbizAiMultiAgentSystemForIndianSmesCrew():
    """BharatbizAiMultiAgentSystemForIndianSmes crew"""

    @agent
    def customer_support_specialist(self, llm) -> Agent:
        return Agent(
            config=self.agents_config['customer_support_specialist'], # type: ignore
            tools=[SerperDevTool()],
            llm = llm
        ) # type: ignore

    @agent
    def business_coordinator(self, llm) -> Agent:
        return Agent(
            config=self.agents_config['business_coordinator'], # type: ignore
            tools=[SerperDevTool()],
            llm = llm
        ) # type: ignore

    @agent
    def inventory_manager(self, llm) -> Agent:
        return Agent(
            config=self.agents_config['inventory_manager'], # type: ignore
            tools=[SerperDevTool()],
            llm = llm
        ) # type: ignore


    @task
    def bilingual_customer_support(self) -> Task:
        return Task(
            config=self.tasks_config['bilingual_customer_support'], # type: ignore
            tools=[SerperDevTool()],
        ) # type: ignore

    @task
    def business_operations_coordination(self) -> Task:
        return Task(
            config=self.tasks_config['business_operations_coordination'], # type: ignore
            tools=[SerperDevTool()],
        ) # type: ignore

    @task
    def inventory_monitoring_and_alerts(self) -> Task:
        return Task(
            config=self.tasks_config['inventory_monitoring_and_alerts'], # type: ignore
            tools=[SerperDevTool()],
        ) # type: ignore


    @crew
    def crew(self, llm) -> Crew:
        """Creates the BharatbizAiMultiAgentSystemForIndianSmes crew"""
        self.agents = [self.customer_support_specialist(llm), self.business_coordinator(llm), self.inventory_manager(llm)]
        self.tasks = [self.bilingual_customer_support(), self.business_operations_coordination(), self.inventory_monitoring_and_alerts()]
        return Crew(
            agents=self.agents, # Automatically created by the @agent decorator # type: ignore
            tasks=self.tasks, # Automatically created by the @task decorator
            process=Process.sequential,
            verbose=True,
        )

