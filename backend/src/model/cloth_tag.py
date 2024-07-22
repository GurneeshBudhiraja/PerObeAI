from pydantic import BaseModel, Field

class Cloth_Image_Tag(BaseModel):
  tag: str = Field(title="Tag",description="The tag of the clothing item in the image provided. Give the tag 'upperwear' for the items that are worn on the upper body and 'lowerwear' for the items that are worn on the lower body. Give the tag 'none' for the items that are not worn on the body.")
