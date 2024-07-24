from langchain.tools import tool
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
import os
load_dotenv()


@tool
def _gemini_recommendation(upperwear_data,lowerwear_data):
  """will get the data of the upperwear and lowerwear and generate the recommendation based on that data"""
  llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash",google_api_key=os.environ.get("GOOGLE_API_KEY"))  
  print(upperwear_data,lowerwear_data)