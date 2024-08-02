# Instance of VectorStore class
from vector_store import VectorStore
from ai_handlers import embed_text
from langchain_core.tools import ToolException

class ClothesRetrievalAgent:
  def __init__(self, user_id:str) -> None:
    self.upperwear_collection:list[dict|None] = []
    self.lowerwear_collection:list[dict|None] = []
    self.user_id = user_id
    self.vector_store_instance = VectorStore(user_id=self.user_id)
  # TODO: may need to change the return value later on
  def get_upperwear_collection(self, user_prompt:str, user_id:str) -> list:
    """
    Retrieves the list of upperwear collection based on the user prompt

    Args:
      user_prompt : str : The user prompt.
      user_id : str : The user id.

    Returns:
      list : The upperwear collection.
    
    """
    try:
      text_embedding = embed_text(text=user_prompt)
      
      search_criteria = {"tag":"upperwear"}
      
      self.upperwear_collection = self.vector_store_instance.fetch_similar_vectors(vector_list=text_embedding, top_k=4, filter=search_criteria, include_metadata=True)

      return # TODO: may need to change the return value later on
    except Exception:
      raise ToolException("Error in get_upperwear_collection tool")
  
  def get_lowerwear_collection(self, user_prompt:str, user_id:str) -> list:
    """
    Retrieves the list of lowerwear collection based on the user prompt

    Args:
      user_prompt : str : The user prompt.
      user_id : str : The user id.

    Returns:
      list : The lowerwear collection.
    
    """
    try:
      text_embedding = embed_text(text=user_prompt)

      search_criteria = {"tag":"lowerwear"}

      self.lowerwear_collection = self.vector_store_instance.fetch_similar_vectors(vector_list=text_embedding, top_k=4, filter=search_criteria, include_metadata=True)

      return # TODO: may need to change the return value later on
    
    except Exception:
      raise ToolException("Error in get_lowerwear_collection tool")
  def invalid_request(self)->dict[str,bool]:
    """
    Custom response for invalid requests

    Returns:
      dict : The response.

    """
    try:
      return {"response":False}
    except Exception:
      raise ToolException("Error in invalid_request tool")
    