from pydantic import BaseModel, Field


class RecommendationRequestBody(BaseModel):

    preferred_fashion_style: str = Field(
        default="",
        title="Preferred Fashion Style",
        description="The preferred fashion style of the user.",
    )

    city: str = Field(default="", title="City", description="The city of the user.")

    user_prompt: str = Field(..., title="User Prompt", description="The user prompt.")

    accessibility: str = Field(
        default="", title="Accessibility", description="The accessibility of the user."
    )
