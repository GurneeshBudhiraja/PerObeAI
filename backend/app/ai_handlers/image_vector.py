from langchain_google_vertexai import VertexAIEmbeddings
from constants import MULTIMODAL_EMBEDDING_MODEL

def get_image_vector(image_url: str) -> list[float]:
    """
    Generates the multimodal embeddings for the image using the Google's multimodalembedding model.

    Args:
        image_url (str): The URL of the image.
    
    Returns:
        list[float]: The vector representation of the image.
    
    """
    try:
        embedding_model = VertexAIEmbeddings(model_name=MULTIMODAL_EMBEDDING_MODEL)
        image_embedding = embedding_model.embed_image(image_path=image_url)
        return image_embedding
    except Exception as e:
        return []
