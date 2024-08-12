from pydantic import BaseModel, Field


class GetImages(BaseModel):
    outfit_description: str = Field(
        ...,
        title="Outfit Description",
        description="The description of the outfit for which the images are to be fetched",
    )
