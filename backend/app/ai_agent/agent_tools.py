from langchain_core.tools import tool, ToolException
from ai_handlers import embed_text
from vector_store import VectorStore
from .agent_utils import format_collection_data

upperwear_collection_data = []
lowerwear_collection_data = []

@tool
def retrieve_upperwear(user_id:str, user_prompt:str)->bool:
  """
  Retrieves the list of upperwear collection based on the user prompt

  Args:
    user_prompt : str : The user prompt.
    user_id : str : The user id.
  
  Returns:
    True : bool 
  """
  try:
    
    global upperwear_collection_data

    text_embedding = embed_text(text=user_prompt)
    
    filter_criteria = {"tag":"upperwear"}

    vector_store_instance = VectorStore(user_id=user_id)

    upperwear_collection_data = vector_store_instance.fetch_similar_vectors(vector_list=text_embedding, top_k=4, filter=filter_criteria, include_metadata=True)

    return True # TODO: may need to change the return value later on
  except Exception:
    raise ToolException("Error in get_upperwear_collection tool")
  



@tool
def retrieve_lowerwear(user_id:str, user_prompt:str)->bool:
  """
  Retrieves the list of lowerwear collection based on the user prompt

  Args:
    user_prompt : str : The user prompt.
    user_id : str : The user id.

  Returns:
    True : bool
  """
  try:
    
    global lowerwear_collection_data

    text_embedding = embed_text(text=user_prompt)

    filter_criteria = {"tag":"lowerwear"}

    vector_store_instance = VectorStore(user_id=user_id)

    lowerwear_collection_data = vector_store_instance.fetch_similar_vectors(vector_list=text_embedding, top_k=4, filter=filter_criteria, include_metadata=True)

    return True # TODO: may need to change the return value later on

  except Exception:
    raise ToolException("Error in get_lowerwear_collection tool")  


@tool(return_direct=True)
def invalid_request()->bool:
  """
  Custom response for invalid requests
  Returns:
    bool : False
  
  """
  try:
    return False
  except Exception:
    raise ToolException("Error in invalid_request tool")


@tool(return_direct=True)
def format_return_data()->dict:
  """
  Format the upperwear/lowerwear or both collections data fetched from the vector store


  Returns:
    dict : The data has been formatted in a list of dictionaries format to return back to the user.
  """
  try:
    
    global upperwear_collection_data, lowerwear_collection_data
    
    prepared_upperwear_data = format_collection_data(upperwear_collection_data)
    prepared_lowerwear_data = format_collection_data(lowerwear_collection_data)
    
    return {"upperwear":prepared_upperwear_data,"lowerwear":prepared_lowerwear_data}
  
  except Exception:
    raise ToolException("Error in format_return_data tool")