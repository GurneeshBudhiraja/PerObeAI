from langchain.tools import tool
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import os
from dotenv import load_dotenv
load_dotenv()


@tool
def _get_embeddings(prompt:str)->list:
  """function responsible for getting the embeddings of the user_prompt and returning the list of embeddings"""
  embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001",google_api_key=os.environ.get("GOOGLE_API_KEY"))
  vector = embeddings.embed_query(prompt)
  return vector


