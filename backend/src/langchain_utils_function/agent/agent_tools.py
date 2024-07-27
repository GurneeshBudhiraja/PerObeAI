from langchain.tools import tool
import os
from dotenv import load_dotenv
load_dotenv()

from pinecone_vector_db.pinecone_class import PineconeClass
from langchain_google_vertexai import VertexAI
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import ChatPromptTemplate

try:
  from .constants import text_vector
except:
  from constants import text_vector

from model.recommendation_output import RecommendedOutfit

""" 
    def fetch_similar_vectors(self, vector_list:list[float|int], top_k:int=3,include_values:bool=False,filter:dict={},include_metadata:bool=False):
"""
# for retrieving the clothes of upperwear tag
# @tool
def retrive_upperwear_clothes(user_id:str, vector_list:list[float|int])->list[dict]:
  """retrieve the clothes data of tag upperwear from the vector database based on the input vector"""
  pinecone_class_instance = PineconeClass(user_id=user_id)
  
  upperwear_clothes_data = pinecone_class_instance.fetch_similar_vectors(vector_list=vector_list, top_k=3, filter={"tag":"upperwear"},include_metadata=True)["matches"] ## list of dicts
  upperwear_collection=[{"type":"image_url","image_url":data["metadata"]["url"]} for data in upperwear_clothes_data]
  return upperwear_collection

# for retrieving the clothes of lowerwear tag
# @tool
def retrive_lowerwear_clothes(user_id:str, vector_list:list[float|int])->list[dict]:
  """retrieve the clothes data of tag lowerwear from the vector database based on the input vector"""
  pinecone_class_instance = PineconeClass(user_id=user_id)
  lowerwear_collection=[]
  lowerwear_clothes_data = pinecone_class_instance.fetch_similar_vectors(vector_list=vector_list, top_k=4, filter={"tag":"lowerwear"},include_metadata=True)["matches"] ## list of dicts
  
  lowerwear_collection=[{"type":"image_url","image_url":data["metadata"]["url"]} for data in lowerwear_clothes_data]
  return lowerwear_collection

# @tool
def get_recommendation(user_input:str, upperwear_collection:list[dict]=[],lowerwear_collection:list[dict]=[],accessibility_type:bool=False)->dict:
  """Will accept the user input, the upperwear collection, lowerwear collection and the accessibility type and will return the recommended outfit or whatever the user_input is"""
  model = VertexAI(model_name="gemini-1.5-flash",temperture=2, top_p=0.95) ## Model for generating the output

  parser = JsonOutputParser(pydantic_object=RecommendedOutfit) ## Parser for parsing the output
  
  prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful bot that helps users answer questions based on the user input. You have to respond according to the {format_instructions}. In addition to the instructions, if the accessibility_type is blind then you have to provide the output explaining each image like how it feels so that the blind person can identify the cloth by feeling it. If the accessibility_type is some kind of color blind disorder then you have to explain the cloth in the color same as the color blind person can see."),
    ("human", "{user_input} and my accessibility type is {accessibility_type}."),
    ("human", "{upperwear_collection}"),
    ("human", "{lowerwear_collection}"),
  ])

  chain = prompt | model | parser
  recommendation = chain.invoke({
    "format_instructions":parser.get_format_instructions(),
    "upperwear_collection":upperwear_collection,
    "lowerwear_collection":lowerwear_collection,
    "user_input":user_input,
    "accessibility_type":accessibility_type
  })
  return recommendation


if __name__=="__main__":
  text_vector_list = text_vector
  # print(retrive_upperwear_clothes(user_id="JKVDl1ErPjaj3TPRNuBUsN3W9xS2",vector_list=text_vector_list))
  # print(retrive_lowerwear_clothes(user_id="JKVDl1ErPjaj3TPRNuBUsN3W9xS2",vector_list=text_vector_list))
  print(get_recommendation(user_input="I have planned to wear navy blue tshirt for the important meeting. Tell me something to match with this.",lowerwear_collection=[
    {
        "type": "image_url",
        "image_url": "https://firebasestorage.googleapis.com/v0/b/perobeai-430021.appspot.com/o/JKVDl1ErPjaj3TPRNuBUsN3W9xS2%2FformalTrousersb536227a-7cea-468c-8bef-c6074c0f4337.png?alt=media&token=4100484b-92e1-4d72-94a0-62be49286a4f", 
    },
    {
        "type": "image_url",
        "image_url": "https://firebasestorage.googleapis.com/v0/b/perobeai-430021.appspot.com/o/JKVDl1ErPjaj3TPRNuBUsN3W9xS2%2F5trackpantsAdidas7758182f-ab91-436a-8bfb-da38d7af200e.png?alt=media&token=ad1dd3fd-1600-4b70-b320-2685a508938e", 
    },
    {
        "type": "image_url",
        "image_url": "https://firebasestorage.googleapis.com/v0/b/perobeai-430021.appspot.com/o/JKVDl1ErPjaj3TPRNuBUsN3W9xS2%2F4lowerGym08b0cf65-ff72-4ca0-9240-ad929108b5f5.png?alt=media&token=8147f549-b05e-4f5f-81fa-1a2529b3e7a5", 
    },],upperwear_collection=[
      # {
      #   "type": "image_url",
      #   "image_url": "https://firebasestorage.googleapis.com/v0/b/perobeai-430021.appspot.com/o/JKVDl1ErPjaj3TPRNuBUsN3W9xS2%2F6tshirtFormal15721fec-107d-49c5-805e-a32ec8713139.png?alt=media&token=9565ba77-f8bf-4b24-be09-278021937c0f"
      # },
      # {
      #   "type": "image_url",
      #   "image_url": "https://firebasestorage.googleapis.com/v0/b/perobeai-430021.appspot.com/o/JKVDl1ErPjaj3TPRNuBUsN3W9xS2%2Fblazer5efc4993c-73ff-4fe9-8b1a-ed5d1c186194.png?alt=media&token=f6a8cf88-3abd-4091-b87d-9d14382a368a"
      # },
      # {
      #   "type": "image_url",
      #   "image_url": "https://firebasestorage.googleapis.com/v0/b/perobeai-430021.appspot.com/o/JKVDl1ErPjaj3TPRNuBUsN3W9xS2%2Fblazer5efc4993c-73ff-4fe9-8b1a-ed5d1c186194.png?alt=media&token=f6a8cf88-3abd-4091-b87d-9d14382a368a"
      # },
      # {
      #   "type": "image_url",
      #   "image_url": "https://firebasestorage.googleapis.com/v0/b/perobeai-430021.appspot.com/o/JKVDl1ErPjaj3TPRNuBUsN3W9xS2%2F8tshirtsportsaffa88aa-b703-4e7b-9a39-677eaa7b58f6.png?alt=media&token=56782767-8f6c-47ea-894f-2324fc976a6f"
      # },
    ]))