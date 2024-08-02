from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

def generate_recommendation(cloth_collections_data : list[dict]|bool, user_prompt:str, accessibility:str=None):
  """
  Function to generate the recommendation based on the user prompt

  Args:
  cloth_collections_data : list[dict] : The cloth collection data fetched from the vector store based on the user prompt

  user_prompt : str : The user prompt

  accessibility : str : The accessibility of the user like 'blind', 'some type of color blindness', or any other type of visual impairment
  """