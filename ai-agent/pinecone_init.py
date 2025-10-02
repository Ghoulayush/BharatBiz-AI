# pinecone_init.py
import os
import logging
import time
from pinecone import Pinecone
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_pinecone import PineconeVectorStore

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_pinecone(max_retries=3):
    """Initialize Pinecone connection with retries"""
    
    # Get API key from environment
    api_key = os.getenv("PINECONE_API_KEY")
    if not api_key:
        raise ValueError("PINECONE_API_KEY environment variable is not set")
    
    # Pinecone configuration
    index_name = "bharatbiz-schemes"
    index_host = "https://bharatbiz-schemes-npppmy9.svc.aped-4627-b74a.pinecone.io"
    
    for attempt in range(max_retries):
        try:
            logger.info(f"Initializing Pinecone (attempt {attempt + 1}/{max_retries})...")
            
            # Initialize Pinecone client
            pc = Pinecone(api_key=api_key)
            
            # Connect to existing index
            logger.info(f"Connecting to index: {index_name}")
            index = pc.Index(index_name)
            
            # Test connection
            logger.info("Testing index connection...")
            stats = index.describe_index_stats()
            logger.info(f"Connected successfully. Index stats: {stats}")
            
            # Initialize embeddings
            logger.info("Initializing embeddings model...")
            embeddings = HuggingFaceEmbeddings(model_name="BAAI/bge-small-en-v1.5")
            
            # Initialize vector store
            logger.info("Creating vector store...")
            vectorstore = PineconeVectorStore(
                index=index,
                embedding=embeddings,
                text_key="text",
                namespace=""
            )
            
            logger.info("Pinecone initialization complete")
            return vectorstore
            
        except Exception as e:
            logger.error(f"Attempt {attempt + 1} failed: {str(e)}")
            if attempt == max_retries - 1:
                raise
            time.sleep(2 ** attempt)  # Exponential backoff

def get_retriever(vectorstore, max_retries=3):
    """Create a retriever with retry logic"""
    for attempt in range(max_retries):
        try:
            return vectorstore.as_retriever(
                search_kwargs={'k': 1},
                search_type="similarity"
            )
        except Exception as e:
            logger.error(f"Retriever creation attempt {attempt + 1} failed: {str(e)}")
            if attempt == max_retries - 1:
                raise
            time.sleep(2 ** attempt)