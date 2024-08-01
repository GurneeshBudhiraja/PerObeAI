from pydantic import BaseModel, Field

class Cloth_Image_Tag(BaseModel):
  tag: str = Field(title="Tag",description="Give a tag to the clothing item. Tag will be 'upperwear' if the item shown in the image is worn on the upper part of the body. The tag will be 'lowerwear' if the item shown in the image is worn on the bottom section of the body. The tag will be 'none' for the clothing accessories like ties, belts, purses, watch, etc. and other non clothing items.")