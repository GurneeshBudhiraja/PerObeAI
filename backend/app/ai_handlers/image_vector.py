from langchain_google_vertexai import VertexAIEmbeddings
from constants import MULTIMODAL_EMBEDDING_MODEL

async def get_image_vector(image_url: str) -> list[float]:
    """
    Generates the image vector for the image using the Google Vertex AI Embeddings model.

    Args:
        image_url (str): The URL of the image.
    
    Returns:
        list[float]: The vector representation of the image.
    
    Raises:
        ValueError: If the image URL is invalid or embeddings could not be generated.
    """
    try:
        embedding_model = VertexAIEmbeddings(model_name=MULTIMODAL_EMBEDDING_MODEL)
        image_vector = await embedding_model.embed_image(image_path=image_url)
        return image_vector
    except Exception as e:
        return []
