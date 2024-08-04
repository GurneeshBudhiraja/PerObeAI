from pydantic import BaseModel, Field, HttpUrl


class DeleteVectorRequest(BaseModel):
    url: HttpUrl = Field(
        ...,
        title="The image url for which the data is to be deleted",
        description="The image url for which the data is to be deleted",
    )
