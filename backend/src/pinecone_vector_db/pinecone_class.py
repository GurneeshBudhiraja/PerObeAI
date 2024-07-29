from pinecone.grpc import PineconeGRPC as pinecone_grpc
import os
from dotenv import load_dotenv
load_dotenv()

class PineconeClass:
  try:

    def __init__(self,user_id:str) -> None:
      self.user_id = user_id
      self.pc = pinecone_grpc(api_key=os.environ.get("PINECONE_API_KEY"))
      ## pinecone db index
      self.index = self.pc.Index(os.getenv("PINECONE_INDEX_NAME"))
    
    def insert_vectors(self,images_vector:list[dict])->int:
      upsert_response = self.index.upsert(
        vectors=images_vector,
        namespace=self.user_id,
      )
      return upsert_response.upserted_count ## returns the total number of vectors inserted/updated

    def fetch_similar_vectors(self, vector_list:list[float|int], top_k:int=3,include_values:bool=False,filter:dict={},include_metadata:bool=False):
      similar_vectors = self.index.query(
        namespace=self.user_id,
        vector=vector_list,
        filter=filter,
        top_k=top_k,
        include_values=include_values,
        include_metadata=include_metadata
      )
      return similar_vectors
    
  except Exception as e:
    raise Exception(f"Error in PineconeClass: {str(e)}")
  

