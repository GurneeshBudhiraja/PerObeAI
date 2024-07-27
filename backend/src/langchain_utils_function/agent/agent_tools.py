from langchain.tools import tool
import os
from dotenv import load_dotenv
load_dotenv()

from pinecone_vector_db.pinecone_class import PineconeClass
try:
  from .constants import text_vector
except:
  from constants import text_vector

""" 
    def fetch_similar_vectors(self, vector_list:list[float|int], top_k:int=3,include_values:bool=False,filter:dict={},include_metadata:bool=False):
"""
# for retrieving the clothes of upperwear tag
# @tool
def retrive_upperwear_clothes(user_id:str, vector_list:list[float|int]):
  """retrieve the clothes data of tag upperwear from the vector database"""
  pinecone_class_instance = PineconeClass(user_id=user_id)
  upperwear_clothes_data = pinecone_class_instance.fetch_similar_vectors(vector_list=vector_list, top_k=4, filter={"tag":"upperwear"},include_metadata=True)
  return upperwear_clothes_data

# for retrieving the clothes of lowerwear tag
# @tool
def retrive_lowerwear_clothes(user_id:str, vector_list:list[float|int]):
  """retrieve the clothes data of tag lowerwear from the vector database"""
  pinecone_class_instance = PineconeClass(user_id=user_id)
  lowerwear_clothes_data = pinecone_class_instance.fetch_similar_vectors(vector_list=vector_list, top_k=1, filter={"tag":"lowerwear"},include_metadata=True)
  return lowerwear_clothes_data["matches"]


if __name__=="__main__":
  # TODO: will add the user_id and vector_list later on by creating the vector first and will use the same user_id
  text_vector_list = text_vector
  # print(retrive_upperwear_clothes(user_id="JKVDl1ErPjaj3TPRNuBUsN3W9xS2",vector_list=text_vector_list))
  print(retrive_lowerwear_clothes(user_id="JKVDl1ErPjaj3TPRNuBUsN3W9xS2",vector_list=text_vector_list))