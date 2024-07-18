from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from typing import Annotated
import os
from utils import utils

router = APIRouter( prefix="/images", tags=["images"] )

# endpoint for separating upperwear and lowerwear images
@router.post("/web/differentiate")
async def create_file(files: list[UploadFile] = File(...)):
  try:
    if not files:
      return JSONResponse(content={"error": "No file uploaded"}, status_code=400)
    else:
        image_dir_name = "src/user_images"
        os.makedirs(image_dir_name,exist_ok=True)
        for file in files:
            # checking if the file is an image
            if file.filename.split(".")[-1] not in ["jpg", "jpeg", "png"]:
              return JSONResponse(content={"error": "Invalid file format"}, status_code=400)
            # saving the file to a specific folder
            image_store_resp = utils.image_store(dir_name=image_dir_name,file_name=file.filename,mode_of_opening="wb+",file=file)
            if not image_store_resp:
              return JSONResponse(content={"error": "Error in saving file"}, status_code=500)
        return JSONResponse(content={"message": "Files uploaded successfully"}, status_code=200)
  except Exception as e:
    raise HTTPException(status_code=500, detail=str("Error: /web/differentiate: " + str(e)))