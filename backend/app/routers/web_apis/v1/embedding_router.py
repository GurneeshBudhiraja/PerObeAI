from fastapi import APIRouter, HTTPException, Depends, status
from firebase_utils import verify_firebase_uid
from models.image_url import ImageURL
from ai_handlers import process_images
from vector_store import VectorStore
from fastapi.responses import (
    JSONResponse,
)  # TODO: will remove this later on after centralizing the response and error handling


router = APIRouter(prefix="/api/web/v1", tags=["embeddings_router"])


@router.post("/image-embeddings")
async def create_image_embeddings(
    images: list[ImageURL], user_id: str  # TODO: will add the depends after debug
) -> None:  # TODO: will change the return type later on
    """
    Route to process the images, generate the multimodal embeddings and formats the data in the required format and stores them in the vector store

    Args:
    images_url (list[dict]): List of dictionaries containing the image urls
    user_id (str): The firebase user id of the user

    Returns:
        # TODO: will add the return type later on
    """

    try:
        processed_images = await process_images(images=images)

        if not processed_images:
            # TODO: will handle this later on with proper response handling
            return {"message": "No valid images found"}

        vector_store_instance = VectorStore(user_id=user_id)

        embeddings_count = vector_store_instance.insert_vectors(
            images_vector_data=processed_images
        )

        # TODO: will change the response later on when the response handling
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message": f"Embeddings count is {embeddings_count}"},
        )
    except Exception as e:
        # TODO: handle the error later on with proper logging and custom class
        raise HTTPException(status_code=500, detail=str("Error in :: " + str(e)))
