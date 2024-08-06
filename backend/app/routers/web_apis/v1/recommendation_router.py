from fastapi import APIRouter, status, Body, Depends
from fastapi.responses import JSONResponse
from app.ai_agents import clothes_recommendation_agent
from app.ai_handlers import validate
from app.models.recommendation_request_body import RecommendationRequestBody
from app.firebase_utils import verify_firebase_uid
from app.errors.custom_exception import CustomException

router = APIRouter(prefix="/api/web/v1", tags=["outfit_recommendation"])


@router.post("/recommend")
# TODO: will add the firebase uid verification
def get_recommendation(
    user_id: str, body: RecommendationRequestBody = Body(...)
) -> JSONResponse:
    """
    Route to get the outfit recommendation based on the user's preferences

    Args:
        user_id (str): The user id of the user
        body (RecommendationRequestBody): The request body

    Returns:
        JSONResponse: The JSON response object
    """
    try:

        user_prompt = body.user_prompt

        city = body.city

        preferred_fashion_style = body.preferred_fashion_style

        accessibility = body.accessibility

        is_valid_user_prompt = validate(user_prompt=user_prompt)

        if not is_valid_user_prompt["is_valid"]:

            return JSONResponse(
                status_code=status.HTTP_200_OK,
                content={"response": is_valid_user_prompt["reply"]},
            )

        agent_response = clothes_recommendation_agent(
            user_id=user_id,
            user_prompt=user_prompt,
            city=city,
            preferred_fashion_style=preferred_fashion_style,
            accessibility=accessibility,
        )

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"response": agent_response["description"]},
        )

    except Exception as e:

        raise CustomException(
            status_code=500,
            message=str(e),
            details={
                "description": "An error occurred while generating the outfit recommendation"
            },
        )
