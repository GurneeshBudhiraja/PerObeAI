from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_google_vertexai import ChatVertexAI
from app.constants import FLASH_MODEL_001
from app.models.validate_prompt import ValidatePrompt
from app.errors.error_handlers import CustomException


def validate(user_prompt: str) -> ValidatePrompt:
    """
    Validate the user prompt

    Args:
      user_prompt (str): The user prompt

    Returns:
      ValidatePrompt: The validation response object

    Raises:
      Exception: An error occurred while validating the user prompt
    """

    try:

        model = ChatVertexAI(model_name=FLASH_MODEL_001, temperature=0.5)

        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "Return the requested response object by following the below instructions\n'{format_instructions}'\n",
                ),
                ("human", "{user_prompt}"),
            ]
        )

        parser = JsonOutputParser(pydantic_object=ValidatePrompt)

        validation_chain = prompt | model | parser

        validation_response = validation_chain.invoke(
            {
                "user_prompt": user_prompt,
                "format_instructions": parser.get_format_instructions(),
            }
        )

        return validation_response

    except Exception as e:
        raise CustomException(
            status_code=500,
            message=str(e),
            details={
                "description": "Ask something valid related to the outfit recommendation"
            },
        )
