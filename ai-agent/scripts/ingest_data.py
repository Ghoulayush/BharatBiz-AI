# scripts/ingest_data.py
import os
from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_pinecone import PineconeVectorStore

load_dotenv()
print("--- Starting data ingestion script ---")

documents = [
    "The Startup India Seed Fund Scheme (SISFS) provides financial assistance to startups for proof of concept, prototype development, product trials, market entry, and commercialization.",
    "Mudra Yojana is a scheme to provide loans up to 10 lakh to non-corporate, non-farm small/micro enterprises.",
    "The Public Procurement Policy for MSEs mandates that every Central Ministry/Department/PSU shall set an annual target for 25% procurement from MSEs.",
    "Stand-Up India Scheme facilitates bank loans between 10 lakh and 1 Crore to at least one Scheduled Caste (SC) or Scheduled Tribe (ST) borrower and at least one woman borrower per bank branch."
]
print(f"Found {len(documents)} documents to ingest.")

print("Initializing embedding model: BAAI/bge-small-en-v1.5...")
# Note: We are using a 384-dimension model, ensure your Pinecone index matches.
embeddings = HuggingFaceEmbeddings(model_name="BAAI/bge-small-en-v1.5")

index_name = "bharatbiz-agent"
print(f"Connecting to Pinecone and ingesting documents into index '{index_name}'...")
PineconeVectorStore.from_texts(
    texts=documents,
    embedding=embeddings,
    index_name=index_name
)

print("\n✅ Ingestion complete! Your agent's memory is now populated.")