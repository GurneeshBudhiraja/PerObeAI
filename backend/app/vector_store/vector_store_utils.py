from vector_store import VectorStore


def insert_vectors(images_vector_data:list[dict], user_id:str)->int:      
  """
  Function to insert the vectors into the vector store
  
  Args:
    images_vector_data (list[dict]): The list of dictionaries containing the image vectors and metadata.
    user_id (str): The user id of the user.
  
  Returns:
    int: The total number of vectors stored.
  """
  try:

    vector_store_instance = VectorStore(user_id=user_id)
    return vector_store_instance.insert_vectors(images_vector_data=images_vector_data)
  except Exception as e:
    # TODO: Add logging and change the error handling later on
    return 0