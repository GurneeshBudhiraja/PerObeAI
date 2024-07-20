from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from typing import Annotated
from utils import utils
import json
from langchain_utils_function.images import images
router = APIRouter( prefix="/api/web/v1/images", tags=["images"] )

# endpoint for separating upperwear and lowerwear images
@router.post("/differentiate")
def create_file(files_url: list[dict])-> dict:
  try:
    clothes_description = dict()
    # get the tags for the images uploaded by the user
    for file_url in files_url:
      cloth_description = images._get_cloth_tag(file_url["url"])
      clothes_description[file_url["url"]] = cloth_description
    return clothes_description

  except Exception as e:
    raise HTTPException(status_code=500, detail=str("Error: /web/differentiate: " + str(e)))