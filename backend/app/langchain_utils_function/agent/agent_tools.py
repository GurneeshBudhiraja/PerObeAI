from langchain.tools import tool
from pinecone_vector_db.pinecone_class import PineconeClass
from langchain_google_vertexai import VertexAI, VertexAIEmbeddings
from dotenv import load_dotenv
load_dotenv()
from model.recommendation_output import RecommendedOutfit
try:
  from constants import LOWERWEAR_COLLECTION,UPPERWEAR_COLLECTION
except:
  from .constants import LOWERWEAR_COLLECTION,UPPERWEAR_COLLECTION
@tool
def retrieve_upperwear(user_id:str,user_prompt:str)->list[dict]:
  """fetches the top 4 upperwear vectors closest to the vector of the prompt_vector from the pinecone db vector store"""
  try:
    pinecone_instance = PineconeClass(user_id=user_id)
    embeddings = get_text_vector(user_prompt=user_prompt)
    upperwear_results = pinecone_instance.fetch_similar_vectors(vector_list=embeddings,top_k=4,filter={"tag":"upperwear"},include_metadata=True)["matches"]
    upperwear_items = [{"type":"image_url","image_url":result["metadata"]["url"]} for result in upperwear_results]
    global UPPERWEAR_COLLECTION
    UPPERWEAR_COLLECTION = upperwear_items
    return UPPERWEAR_COLLECTION
  except Exception as e:
    print(f"Error in get_similar_clothing_items tool: {str(e)}")

@tool
def retrieve_lowerwear(user_id:str,user_prompt:str)->list[dict]:
  """fetches the top 4 lowerwear vectors closest to the vector of the prompt_vector from the pinecone db vector store"""
  try:
    pinecone_instance = PineconeClass(user_id=user_id)
    embeddings = get_text_vector(user_prompt=user_prompt)
    lowerwear_results = pinecone_instance.fetch_similar_vectors(vector_list=embeddings,top_k=4,filter={"tag":"lowerwear"},include_metadata=True)["matches"]
    lowerwear_items = [{"type":"image_url","image_url":result["metadata"]["url"]} for result in lowerwear_results]
    global LOWERWEAR_COLLECTION
    LOWERWEAR_COLLECTION = lowerwear_items
    return LOWERWEAR_COLLECTION
  except Exception as e:
    print(f"Error in get_similar_clothing_items tool: {str(e)}")


def get_text_vector(user_prompt:str)->list[float]:
  """Will accept the user input and will return the vector of the user input"""
  embedding_model = VertexAIEmbeddings(model_name="multimodalembedding")
  image_vector = embedding_model.embed_query(text=user_prompt)
  return image_vector
