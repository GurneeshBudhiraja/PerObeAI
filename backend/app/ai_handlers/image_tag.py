from typing import Optional
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from app.models.cloth_tag import ClothImageTag
from app.constants import FLASH_MODEL_001


async def get_image_tag(image_url: str) -> ClothImageTag:
    """
    Uses Gemini API to generate the image tag for the given image url

    Args:
        image_url (str): Image url for which the tag needs to be generated

    Returns:
        Cloth_Image_Tag: Image tag of the image generated from the model

    Raises:
        Exception: If an error occurs while generating the image tag
    """
    try:
        model = ChatGoogleGenerativeAI(model=FLASH_MODEL_001, temperature=0.6)

        parser = JsonOutputParser(pydantic_object=ClothImageTag)

        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "Return the requested response object by following the below instructions\n'{format_instructions}'\n",
                ),
                (
                    "human",
                    [
                        {
                            "type": "image_url",
                            "image_url": image_url,
                        },
                    ],
                ),
            ]
        )

        chain = prompt | model | parser

        tag_data = chain.invoke(
            {"format_instructions": parser.get_format_instructions()}
        )
        return tag_data

    except Exception:
        raise Exception
