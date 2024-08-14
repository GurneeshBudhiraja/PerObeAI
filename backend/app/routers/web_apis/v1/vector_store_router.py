from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from app.errors.custom_exception import CustomException
from app.models.image_url import ImageURL
from app.vector_store import VectorStore
from app.firebase_utils import verify_firebase_uid


router = APIRouter(prefix="/api/web/v1/vector", tags=["vector store operations"])


@router.delete("/delete")
def delete_vector(
    image_data: ImageURL, user_id: str = Depends(verify_firebase_uid)
) -> JSONResponse:
    """
    Deletes the vector from the vector store

    Args:
        image_data (dict): The image url for which the vector is to be deleted
        user_id (str): The user id of the user

    Returns:
        JSONResponse: A JSON response
    """
    try:
        image_url = str(image_data.url)

        vector_store_instance = VectorStore(user_id=user_id)

        delete_response = vector_store_instance.delete_vector(image_url=image_url)

        return JSONResponse(status_code=200, content=delete_response)

    except Exception as e:
        raise CustomException(
            status_code=500,
            message=str(e),
            details={"description": "An error occurred while deleting the vector"},
        )
