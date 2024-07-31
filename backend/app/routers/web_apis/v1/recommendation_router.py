from fastapi import APIRouter, HTTPException, status, Form
from fastapi.responses import JSONResponse
from typing import Annotated
from langchain_utils_function.agent import agent

router = APIRouter(prefix="/api/v1/web", tags=["outfit_recommendation"])



@router.get("/recommend")
def get_recommendation(prompt:Annotated[str,Form()],user_id: str) -> JSONResponse:
  try:
    if not user_id:
      raise Exception("User id is required")    
    resp = agent._recommend(user_id=user_id,user_prompt=prompt)
    return JSONResponse(content={"data":resp},status_code=status.HTTP_200_OK)
  except Exception as e:
    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))