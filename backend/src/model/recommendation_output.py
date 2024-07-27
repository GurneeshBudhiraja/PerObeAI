from pydantic import BaseModel, Field

class RecommendedOutfit(BaseModel):
  upperwear_url:str = Field( title="upperwear_url",description="the url from the upperwear collection if the user asked for upperwear recommendation which when paired with the lowerwear collection will give the best outfit. Returns 'none' if the user did not ask for upperwear recommendation")
  lowerwear_url:str = Field(title="lowerwear_url",description="the url from the lowerwear collection if the user asked for lowerwear recommendation which when paired with the upperwear collection will give the best outfit. Returns 'none' if the user did not ask for lowerwear recommendation")