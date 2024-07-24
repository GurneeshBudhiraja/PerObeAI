from langchain_core.tools import tool
from langchain_astradb import AstraDBVectorStore
from model.astra_db import VectorStore
@tool
def _retrieve_upperwear(user_id:str,prompt_vector:list):
  """fetches the lowerwear vectors closest to the vector of the user prompt of from the asta db vector store"""
  vstore = VectorStore(user_id)
  upperwear_results = vstore.similarity_search(embedding=prompt_vector,k=3,filter={"type":"upperwear"})
  return upperwear_results
