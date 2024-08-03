from langchain_core.tools import tool, ToolException
from ai_handlers import embed_text
from vector_store import VectorStore
from .agent_utils import format_collection_data
from constants import BASE_URL
import requests
import os
from ai_handlers import generate_recommendation

upperwear_collection_data = []
lowerwear_collection_data = []



@tool
def get_temperature_by_city(city:str)->dict:
  """
  Gets the temperature by city name

  Args:
    city : str : The city name.

  Returns:
    dict : The temperature data
  """
  try:
    URL = BASE_URL + "q=" + city + "&appid=" + os.getenv("WEATHER_API_KEY")
    weather_data =  requests.get(URL).json()
    return weather_data  
  except Exception:
    #TODO: will handle the error later on with proper logging and custom class
    raise ToolException("Error in get_temperature_by_city tool")
  

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
    True : bool = A boolean value to indicate the success of the tool
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


@tool
def format_return_data()->dict:
  """
  Format the upperwear/lowerwear or both collections data fetched from the vector store


  Returns:
    True : bool = A boolean value to indicate the success of the tool
  """
  try:
    
    global upperwear_collection_data, lowerwear_collection_data
    
    upperwear_collection_data = format_collection_data(upperwear_collection_data)
    lowerwear_collection_data = format_collection_data(lowerwear_collection_data)
    
    # return True
    return {"upperwear_collection":upperwear_collection_data, "lowerwear_collection":lowerwear_collection_data}
  
  except Exception:
    raise ToolException("Error in format_return_data tool")
  


@tool(return_direct=True)
def gemini_recommendation(user_prompt:str, accessibility:str)->dict:
  """
  Function to get the final recommendation based on the upperwear and lowerwear data fetched


  Args:
    user_prompt : str : The user prompt
    accessibility : str : The accessibility of the user like 'blind', 'some type of color blindness', or any other type of visual impairment

  Returns:
    dict : The final recommendation based on the upperwear and lowerwear data
  """
  
  
  return generate_recommendation(upperwer_collection=upperwear_collection_data, lowerwear_collection=lowerwear_collection_data, user_prompt=user_prompt, accessibility=accessibility)
