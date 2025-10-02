import logging
from agent_core import agent_executor

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_emi_calculation():
    logger.info("Testing EMI calculator...")
    query = "Calculate EMI for P=100000, r=10.5, n=12"
    try:
        result = agent_executor.invoke({"input": query, "chat_history": []})
        logger.info(f"EMI calculation result: {result}")
        return True
    except Exception as e:
        logger.error(f"EMI calculation failed: {e}")
        return False

def test_scheme_search():
    logger.info("Testing scheme search...")
    query = "Tell me about PMEGP scheme"
    try:
        result = agent_executor.invoke({"input": query, "chat_history": []})
        logger.info(f"Scheme search result: {result}")
        return True
    except Exception as e:
        logger.error(f"Scheme search failed: {e}")
        return False

if __name__ == "__main__":
    logger.info("Starting agent tests...")
    
    emi_test = test_emi_calculation()
    logger.info(f"EMI test {'passed' if emi_test else 'failed'}")
    
    scheme_test = test_scheme_search()
    logger.info(f"Scheme search test {'passed' if scheme_test else 'failed'}")