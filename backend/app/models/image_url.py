from pydantic import BaseModel, Field, HttpUrl


class ImageURL(BaseModel):
    url: HttpUrl = Field(
        ...,
        title="The image url",
        description="The image url on which the operation is to be performed",
    )
