from langchain_core.tools import tool
from model.astra_db import VectorStore
@tool
def _retrieve_lowerwear(user_id:str,prompt_vector:list):
  """fetches the lowerwear vectors closest to the vector of the user prompt of from the asta db vector store"""
  vstore = VectorStore(user_id)
  lowerwear_results = vstore.similarity_search_by_vector(embedding=prompt_vector,k=3,filter={"type":"lowerwear"})
  return lowerwear_results