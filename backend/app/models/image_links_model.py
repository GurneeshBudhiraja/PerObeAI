from pydantic import BaseModel, Field

class ImageLinks(BaseModel):
  images_urls: list[str] = Field(...,title="Get Image URLs",description="Using the description provided you will find the images using the image urls and find the exact image urls of the clothing items that are described in the description provided.")