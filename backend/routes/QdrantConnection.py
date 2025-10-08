import os
from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient, models
from dotenv import load_dotenv
load_dotenv()

def setup_qdrant_client():
        """Initializes a Qdrant client connected to a Qdrant Cloud cluster."""
        print("🚀 Connecting to Qdrant Cloud...")
        
        url = os.getenv("QDRANT_URL")
        api_key = os.getenv("QDRANT_API_KEY")

        if not url or not api_key:
            raise ValueError(
                "QDRANT_URL and QDRANT_API_KEY environment variables must be set."
            )

        client = QdrantClient(url=url, api_key=api_key,timeout=None)
        print("✅ Successfully connected to Qdrant Cloud!")
        return client

qudrant_connection_var = setup_qdrant_client()

def setup_embedding_model(model_name: str = 'BAAI/bge-small-en-v1.5'):
        print(f"📚 Loading embedding model: '{model_name}'")
        return SentenceTransformer(model_name)

sentence_transformer_var = setup_embedding_model()