from vector_store import VectorStore


def insert_vectors(images_vectors:list[dict], user_id:str)->int:      
  """
  Function to insert the vectors into the vector store
  
  Args:
    images_vectors (list[dict]): The list of dictionaries containing the image vectors and metadata.
    user_id (str): The user id of the user.
  
  Returns:
    # TODO: Change the return type to the response
    int: The total number of vectors stored.
  """
  vector_store_instance = VectorStore(user_id=user_id)
  return vector_store_instance.insert_vectors(images_vector=images_vectors)