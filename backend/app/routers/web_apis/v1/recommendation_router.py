from fastapi import APIRouter, HTTPException, status, Body, Depends
from fastapi.responses import JSONResponse
from ai_handlers import generate_recommendation
from ai_agent import agent
from models.recommendation_body import RecommendationBody
from firebase_utils import verify_firebase_uid
router = APIRouter(prefix="/api/web/v1", tags=["outfit_recommendation"])

@router.get("/recommend")
# TODO: will add the firebase uid verification
def get_recommendation(user_id:str, body: RecommendationBody = Body(...)) -> JSONResponse:
  try:
    user_prompt = body.user_prompt
    city = body.city
    preferred_fashion_style = body.preferred_fashion_style
    accessibility = body.accessibility
    agent_response = agent(user_id=user_id,user_prompt=user_prompt,city=city,preferred_fashion_style=preferred_fashion_style)
    # TODO: will send the data to the recommendation model here
    # recommended_clothes = generate_recommendation(cloth_collections_data=agent_response,user_prompt=user_prompt,)
    if not agent_response:
      return JSONResponse(content={"response":False},status_code=status.HTTP_404_NOT_FOUND)
    return JSONResponse(content={"response":agent_response},status_code=status.HTTP_200_OK)

  except Exception as e:
    print(f"Error in get_recommendation: {str(e)}")
    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))