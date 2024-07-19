from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from typing import Annotated
from utils import utils
import json
from langchain_functions.images import images
router = APIRouter( prefix="/api/web/v1/images", tags=["images"] )

# endpoint for separating upperwear and lowerwear images
@router.post("/differentiate")
def create_file(files_url: list[dict]):
  try:
    cloth_tags_resp = []
    upperwear=[] ; lowerwear=[]
    # get the tags for the images uploaded by the user
    for file_url in files_url:
      tag = images._get_cloth_tag(file_url["url"])["tag"]
      cloth_tags_resp.append({"url":file_url["url"],"tag":tag})
    for i in cloth_tags_resp:
      if i["tag"]=="upperwear":
        upperwear.append(i)
      elif i["tag"]=="lowerwear":
        lowerwear.append(i)
    return (upperwear,lowerwear)

  except Exception as e:
    raise HTTPException(status_code=500, detail=str("Error: /web/differentiate: " + str(e)))