from langchain_core.tools import tool
from ai_handlers import embed_text, generate_recommendation
from vector_store import VectorStore
from .agent_utils import format_collection_data
from constants import BASE_URL, TOP_K
import requests
import os

# Global variables to store the upperwear and lowerwear collection data fetched from the vector store
UPPERWEAR_COLLECTION_DATA = []
LOWERWEAR_COLLECTION_DATA = []



@tool
def get_temperature_by_city(city:str)->dict:
  """
  Gets the temperature by city name using the OpenWeatherMap API

  Args:
    city : str : The city name.

  Returns:
    dict : The temperature data is successfully fetched from the API otherwise an empty dictionary
  """
  try:
    URL = BASE_URL + "q=" + city + "&appid=" + os.getenv("WEATHER_API_KEY")
    weather_data =  requests.get(URL).json()
    return weather_data  
  except Exception:
    #TODO: will handle the error later on with proper logging and custom class
    return {}
  

@tool
def retrieve_upperwear(user_id:str, user_prompt:str)->bool:
  """
  Retrieves the list of upperwear collection based on the user prompt and assings to the global variable UPPERWEAR_COLLECTION_DATA

  Args:
    user_prompt : str : The user prompt.
    user_id : str : The user id.
  
  Returns:
    True : bool = A boolean value to indicate the success of the tool otherwise False
  """
  try:
    
    global UPPERWEAR_COLLECTION_DATA

    text_embedding = embed_text(text=user_prompt)
    
    filter_criteria = {"tag":"upperwear"}

    vector_store_instance = VectorStore(user_id=user_id)

    UPPERWEAR_COLLECTION_DATA = vector_store_instance.fetch_similar_vectors(vector_list=text_embedding, top_k=TOP_K, filter=filter_criteria, include_metadata=True)

    return True
  except Exception as e:
    # TODO: will handle the error later on with proper logging and custom class
    return False
    

@tool
def retrieve_lowerwear(user_id:str, user_prompt:str)->bool:
  """
  Retrieves the list of lowerwear collection based on the user prompt and assings to the global variable LOWERWEAR_COLLECTION_DATA

  Args:
    user_prompt : str : The user prompt.
    user_id : str : The user id.

  Returns:
    True : bool = A boolean value to indicate the success of the tool otherwise False
  """
  try:
    
    global LOWERWEAR_COLLECTION_DATA

    text_embedding = embed_text(text=user_prompt)

    filter_criteria = {"tag":"lowerwear"}

    vector_store_instance = VectorStore(user_id=user_id)

    LOWERWEAR_COLLECTION_DATA = vector_store_instance.fetch_similar_vectors(vector_list=text_embedding, top_k=TOP_K, filter=filter_criteria, include_metadata=True)

    return True 

  except Exception as e:
    # TODO: will handle the error later on with proper logging and custom class
    return False


@tool
def format_return_data()->bool:
  """
  Format the upperwear/lowerwear collections data fetched from the vector store

  Returns:
    True : bool = A boolean value to indicate the success of the tool otherwise False
  """
  try:
    
    global UPPERWEAR_COLLECTION_DATA, LOWERWEAR_COLLECTION_DATA
    
    UPPERWEAR_COLLECTION_DATA = format_collection_data(UPPERWEAR_COLLECTION_DATA)
    LOWERWEAR_COLLECTION_DATA = format_collection_data(LOWERWEAR_COLLECTION_DATA)
    
    return True
  
  except Exception:
    # TODO: will handle the error later on with proper logging and custom class
    return False
  


@tool(return_direct=True)
def generate_outfit_recommendation(user_prompt:str, accessibility:str)->dict:
  """
  Get the final recommendation based on the upperwear and lowerwear data fetched from the vector store

  Args:
    user_prompt : str : The user prompt
    accessibility : str : The accessibility of the user like 'blind', 'color blindness of some type', or any other type of visual impairment

  Returns:
    dict : The final recommendation based on the upperwear and lowerwear data otherwise a dictionary with error message
  """

  try:
    return generate_recommendation(upperwer_collection=UPPERWEAR_COLLECTION_DATA, lowerwear_collection=LOWERWEAR_COLLECTION_DATA, user_prompt=user_prompt, accessibility=accessibility)
  
  except Exception: 
    #TODO: will handle the error later on with proper logging and custom class
    return {"error":"Error in generating recommendation"}