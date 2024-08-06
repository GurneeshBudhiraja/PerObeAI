from pydantic import BaseModel, Field


class ValidatePrompt(BaseModel):

    is_valid: bool = Field(
        ...,
        title="The prompt is valid or not",
        description="Your aim to check if the prompt is valid or not. The prompt will only considered to be valid if the prompt is asking anything related to the outfit recommendation. The prompt will be considered valid as well even if the prompt is incomplete but asks something about the outfit recommendation. If the prompt is not asking anything about the prompt validation then the prompt will be considered as invalid. At last, the reply field will remain None if the is_valid field is True",
    )

    reply: str = Field(
        None,
        title="User prompt reply",
        description="Construct a positive, friendly reply to the user declining the request and you can only help users create outfit recommendations. You can also add a message like how the prompts should look like to be considered valid. You will only use letters for this. No special characters are allowed. At last, instead of using double quotes, use single quotes for quoting the message",
    )
