from langchain_google_vertexai import VertexAIEmbeddings
from app.constants import MULTIMODAL_EMBEDDING_MODEL
from utils import logger


def embed_text(text: str) -> list[float]:
    """
    Function to get the text vector of the given text

    Args:
      text : str : The text for which the vector is to be generated.

    Returns:
      list[float] : The text vector.
    """
    try:

        embedding_model = VertexAIEmbeddings(model_name=MULTIMODAL_EMBEDDING_MODEL)

        text_embedding = embedding_model.embed_query(text=text)

        return text_embedding

    except Exception as e:

        logger.error(f"embed_text error: {e}")

        raise Exception
