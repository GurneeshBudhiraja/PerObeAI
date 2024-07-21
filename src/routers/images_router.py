from fastapi import APIRouter, HTTPException, status
from fastapi.responses import JSONResponse
from langchain_utils_function.images import images

router = APIRouter( prefix="/api/web/v1/images", tags=["images"] )

# endpoint for separating upperwear and lowerwear images
@router.post("/differentiate")
def create_file(images_url: list[dict])-> dict:
  try:
    # get the tags for the images uploaded by the user
    for image_url in images_url:
      count = 0
      cloth_vector_response = images._get_image_tag(image_url=image_url["url"])
      ## for debugging
      print(f"cloth_description: /n {count} : {cloth_vector_response}")
      count += 1
      if "error" in cloth_vector_response:
        raise Exception("Error in getting the image tag")
    return JSONResponse(status_code=status.HTTP_200_OK, content={"response" : 200})
  except Exception as e:
    raise HTTPException(status_code=500, detail=str("Error in :: /web/v1/images/differentiate: " + str(e)))