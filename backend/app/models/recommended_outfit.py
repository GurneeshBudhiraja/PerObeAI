from pydantic import BaseModel, Field

class RecommendOutfit(BaseModel):
  outfit_urls: list[dict] = Field(..., title="")
