from fastapi import APIRouter, HTTPException, status, Form
from fastapi.responses import JSONResponse
from typing import Annotated
from langchain_utils_function.recommendation import recommendation
import json

router = APIRouter(prefix="/api/v1/web", tags=["outfit_recommendation"])



@router.get("/recommend")
def get_recommendation(prompt:Annotated[str,Form()],user_id: str) -> JSONResponse:
  try:
    if not user_id:
      raise Exception("User id is required")
    similarity_upperwear = recommendation._get_similar_resuls(prompt=prompt,user_id=user_id,filter={"tag":"upperwear"})
    similarity_lowerwear = recommendation._get_similar_resuls(prompt=prompt,user_id=user_id,filter={"tag":"lowerwear"})
    upperwear=list()
    lowerwear=list()
    for cloth_item in similarity_lowerwear:
      dictionary=dict()
      dictionary["type"]=cloth_item.metadata["tag"]
      dictionary["url"]=cloth_item.metadata["image_url"]
      dictionary["description"] = cloth_item.page_content
      lowerwear.append(dictionary)
    for cloth_item in similarity_upperwear:
      dictionary=dict()
      dictionary["type"]=cloth_item.metadata["tag"]
      dictionary["url"]=cloth_item.metadata["image_url"]
      dictionary["description"] = cloth_item.page_content
      upperwear.append(dictionary)
    geminiResp = recommendation._gemini_recommends(prompt=prompt,upperwear=upperwear,lowerwear=lowerwear)
    print("geminiResp \n",geminiResp)
    return lowerwear
  except Exception as e:
    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))