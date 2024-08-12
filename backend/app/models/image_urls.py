from pydantic import BaseModel, Field


class ImageURLs(BaseModel):
    image_urls: list[dict] = Field(
        ...,
        title="Image URLs of the outfit description",
        description="Pick the image URL(s) provided to you and return the image url(s)  which has the image of the clothing item(s) mentioned in the outfit description",
    )
