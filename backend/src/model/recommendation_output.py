from pydantic import BaseModel, Field

class RecommendedOutfit(BaseModel):
  outfit_urls: list[dict] = Field(..., title="Which cloth you would pick for the input by the user such that when both paired together makes a great outfit. Provide me the links from both upperwear and lowerwear section such that when both of them paired together makes a great outfit. You will return the upperwear link with key upperwear and lowerwear link with the key lowerwear in the output. You have to give only 2 urls one from each section if the whole outfit recommendation has been asked. Make sure to account the weather factor as well while recommending the outfit to the user")
