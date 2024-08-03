from pydantic import BaseModel, Field

class ImageLinks(BaseModel):
  
  images_urls: list[str] = Field(...,title="Get Image URLs",description="Give me the list of images that matches with the description. The number of images should be equal to the number of items mentioned in the description.")