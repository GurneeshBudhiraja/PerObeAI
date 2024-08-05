from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from errors.custom_exception import CustomException
from models.vector_store_operations import DeleteVectorRequest
from vector_store import VectorStore

router = APIRouter(prefix="/api/web/v1/vector", tags=["vector store operations"])


@router.delete("/delete")
# TODO: will add the authentication and return type later on
def delete_vector(image_data: DeleteVectorRequest, user_id: str):
    """
    Deletes the vector from the vector store

    Args:
      image_data (dict): The image url for which the vector is to be deleted
      user_id (str): The user id of the user

    Returns:
      # TODO: Add the return type later on
    """
    try:
        image_url = str(image_data.url)

        vector_store_instance = VectorStore(user_id=user_id)

        delete_response = vector_store_instance.delete_vector(image_url=image_url)

        # TODO: will handle the return type later on
        if delete_response["response"]:
            return JSONResponse(
                status_code=200, content={"response": delete_response["response"]}
            )

        else:
            # TODO: will handle the custom response here later on
            return JSONResponse(
                status_code=404,
                content={"response": "No vector found for the given image"},
            )

    except Exception as e:
        raise CustomException(
            status_code=500,
            message=str(e),
            details={"description": "An error occurred while deleting the vector"},
        )
