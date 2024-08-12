from fastapi.responses import JSONResponse
from app.errors.custom_exception import CustomException
from app.ai_handlers.text_vector import embed_text
from app.vector_store import VectorStore


def get_images_from_description(user_id: str, outfit_description: str) -> JSONResponse:
    try:
        """
        Get the image URLs from the outfit description

        Args:
          outfit_description (str): The outfit description

        Returns:
          JSONResponse: The JSON response object
        """

        description_vector_embedding = embed_text(text=outfit_description)

        vector_store_instance = VectorStore(user_id=user_id)

        upperwear_data = vector_store_instance.fetch_similar_vectors(
            vector_list=description_vector_embedding,
            include_metadata=True,
            filter={"tag": "upperwear"},
            top_k=1,
        )

        lowerwear_data = vector_store_instance.fetch_similar_vectors(
            vector_list=description_vector_embedding,
            include_metadata=True,
            filter={"tag": "lowerwear"},
            top_k=1,
        )

        upperwear_urls = [
            {"url": collection["metadata"]["url"]}
            for collection in upperwear_data["matches"]
        ]

        lowerwear_urls = [
            {"url": collection["metadata"]["url"]}
            for collection in lowerwear_data["matches"]
        ]

        images_urls = upperwear_urls + lowerwear_urls

        return images_urls

    except Exception as e:
        raise CustomException(
            status_code=500,
            detail=f"An error occurred while fetching images from the description: {str(e)}",
        )
