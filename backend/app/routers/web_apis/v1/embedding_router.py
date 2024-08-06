from fastapi import APIRouter, Depends, status
from fastapi.responses import (
    JSONResponse,
)

from app.firebase_utils import verify_firebase_uid
from app.ai_handlers import process_images
from app.vector_store import VectorStore
from app.errors.custom_exception import CustomException
from app.models.image_url import ImageURL


router = APIRouter(prefix="/api/web/v1", tags=["embeddings_router"])


@router.post("/image-embeddings")
async def create_image_embeddings(
    images: list[ImageURL], user_id: str  # TODO: will add the depends after debug
) -> JSONResponse:
    """
    Route to process the images, generate the multimodal embeddings and formats the data in the required format and stores them in the vector store

    Args:
        images (list[ImageURL]): The list of image urls
        user_id (str): The user id of the user

    Returns:
        JSONResponse: The JSON response object
    """

    try:
        processed_images = await process_images(images=images)

        if not processed_images:

            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={
                    "embeddings": len(processed_images),
                    "description": "no clothing images found",
                },
            )

        vector_store_instance = VectorStore(user_id=user_id)

        embeddings_count = vector_store_instance.insert_vectors(
            images_vector_data=processed_images
        )

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={
                "embeddings": embeddings_count,
                "description": "embeddings stored successfully",
            },
        )

    except Exception as e:

        raise CustomException(
            status_code=500,
            message=str(e),
            details={
                "description": "An error occurred while generating/storing the embeddings"
            },
        )
