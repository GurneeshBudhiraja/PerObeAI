from langchain_core.tools import tool, ToolException
from ai_handlers import embed_text
from vector_store import VectorStore

upperwear_collection = []
lowerwear_collection = []

@tool
def retrieve_upperwear(user_id:str, user_prompt:str)->dict:
  """
  Retrieves the list of upperwear collection based on the user prompt

  Args:
    user_prompt : str : The user prompt.
    user_id : str : The user id.
  
  Returns:
    dict : The upperwear collection
  """
  try:
    global upperwear_collection
    text_embedding = embed_text(text=user_prompt)
    
    filter_criteria = {"tag":"upperwear"}

    vector_store_instance = VectorStore(user_id=user_id)

    upperwear_collection = vector_store_instance.fetch_similar_vectors(vector_list=text_embedding, top_k=4, filter=filter_criteria, include_metadata=True)

    print(f"UPPERWEAR COLLECTION IN TOOL: {upperwear_collection}")
    return  upperwear_collection # TODO: may need to change the return value later on
  except Exception:
    raise ToolException("Error in get_upperwear_collection tool")
  



@tool
def retrieve_lowerwear(user_id:str, user_prompt:str)->dict:
  """
  Retrieves the list of lowerwear collection based on the user prompt

  Args:
    user_prompt : str : The user prompt.
    user_id : str : The user id.

  Returns:
    dict : The lowerwear collection.
  """
  try:
    global lowerwear_collection
    text_embedding = embed_text(text=user_prompt)

    filter_criteria = {"tag":"lowerwear"}

    vector_store_instance = VectorStore(user_id=user_id)

    lowerwear_collection = vector_store_instance.fetch_similar_vectors(vector_list=text_embedding, top_k=4, filter=filter_criteria, include_metadata=True)

    return lowerwear_collection # TODO: may need to change the return value later on

  except Exception:
    raise ToolException("Error in get_lowerwear_collection tool")  


@tool(return_direct=True)
def invalid_request():
  """
  Custom response for invalid requests

  Returns:
    dict : The response
  
  """
  try:
    return {"response":False}
  except Exception:
    raise ToolException("Error in invalid_request tool")

@tool(return_direct=True)
def format_return_data()->dict:
  """
  Formats the upperwear and lowerwear collection fetched and returns the formatted data

  Returns:
    dict : The formatted data
  """
  try:
    global upperwear_collection, lowerwear_collection
    return {"upperwear_collection":upperwear_collection,"lowerwear_collection":lowerwear_collection}
  except Exception:
    raise ToolException("Error in format_return_data tool")