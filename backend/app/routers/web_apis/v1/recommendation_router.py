from fastapi import APIRouter, HTTPException, status, Form
from fastapi.responses import JSONResponse

from ai_agent import agent

router = APIRouter(prefix="/api/web/v1", tags=["outfit_recommendation"])

@router.get("/recommend")
# TODO: will add the firebase uid verification
def get_recommendation(user_id: str, prompt:str=Form(...)) -> JSONResponse:
  try:
    resp = agent(user_id=user_id,user_prompt=prompt)
    try:
      if(resp["output"]["response"]==False):
        return JSONResponse(content={"response":"Invalid Request"},status_code=status.HTTP_200_OK)
    except:
      pass

    return JSONResponse(content={"response":"Success"},status_code=status.HTTP_200_OK)

    return JSONResponse(content={"status":200})
  except Exception as e:
    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))