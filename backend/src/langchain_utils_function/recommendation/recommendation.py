from langchain_google_genai import GoogleGenerativeAIEmbeddings
try:
  from model.astra_db import VectorStore
except Exception as e:
  pass
from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_google_genai import ChatGoogleGenerativeAI
from pydantic import BaseModel, Field
import os
load_dotenv()

def _get_similar_resuls(prompt:str,user_id:str,filter:dict,k:int=3):
  vector_store = VectorStore(user_id=user_id)
  results = vector_store.similarity_search(prompt,k,filter=filter)
  return results

def _gemini_recommends(prompt:str, upperwear:list[dict]|None=None,lowerwear:list[dict]|None=None):
  try:
    ## TODO: create the chain for the gemini recommendation
    pass
  except Exception as e:
    print(e)


if __name__=="__main__":
  print(_gemini_recommends("What is the best outfit for a party?"))