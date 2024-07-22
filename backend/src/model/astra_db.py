from langchain_astradb import AstraDBVectorStore
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import os
from dotenv import load_dotenv

load_dotenv()

## class for the astradb vector store
class VectorStore:
  def __new__(cls,user_id:str):
    embedding_model = GoogleGenerativeAIEmbeddings(model="models/embedding-001" ,api_key=os.getenv("GOOGLE_API_KEY"))
    vector_store = AstraDBVectorStore(
      embedding=embedding_model,
      api_endpoint=os.getenv("ASTRA_DB_API_ENDPOINT"),
      collection_name=user_id,
      token=os.getenv("ASTRA_DB_APPLICATION_TOKEN"),
      namespace=os.getenv("ASTRA_DB_KEYSPACE"),
    )
    return vector_store