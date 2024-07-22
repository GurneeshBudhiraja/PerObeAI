from fastapi import APIRouter, HTTPException, status
from fastapi.responses import JSONResponse
from langchain_utils_function.images import images

router = APIRouter( prefix="/api/v1/web", tags=["images"] )

# endpoint for separating upperwear and lowerwear images
@router.post("/embeddings")
def create_file(images_url: list[dict],user_id:str)-> dict:
  try:
    # function responsible for generating and storing the embeddings of the images
    embeddings_response = images.main(images_url=images_url,user_id=user_id)
    if not embeddings_response:
      return JSONResponse(status_code=status.HTTP_400_BAD_REQUEST, content={"response" : 400})
    else:
      return JSONResponse(status_code=status.HTTP_200_OK, content={"response" : embeddings_response})
  except Exception as e:
    raise HTTPException(status_code=500, detail=str("Error in :: /web/v1/images/differentiate: " + str(e)))