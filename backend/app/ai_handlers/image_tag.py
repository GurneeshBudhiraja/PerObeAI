from typing import Optional
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
# Model class for structuring the output
from models.cloth_tag import Cloth_Image_Tag
# Gemini flash model from constants
from constants import FLASH_MODEL_001


async def get_image_tag(image_url:str) -> Optional[Cloth_Image_Tag]:
    """
    Uses Gemini API to generate the image tag for the given image url

    Args:
        image_url (str): Image url for which the tag needs to be generated

    Returns:
        Optional[Cloth_Image_Tag]: Image tag of the image generated from the model
    """
    try:
        
        # Model with the gemini-1.5-flash-001 model
        model = ChatGoogleGenerativeAI(model=FLASH_MODEL_001, temperature=0.6)

        parser = JsonOutputParser(pydantic_object=Cloth_Image_Tag) 


        prompt = ChatPromptTemplate.from_messages([
            ("system", "Return the requested response object by following the below instructions\n'{format_instructions}'\n"),
            ("human", [
                {
                "type": "image_url",
                "image_url": image_url, 
                },
            ]),
        ])

        chain = prompt | model | parser 

        chain_resp = chain.invoke({"format_instructions": parser.get_format_instructions()})
        return chain_resp
    except Exception as e:
        # TODO: Add logging and change the error handling later on
        return {"error": f"Error in _get_image_tag: {str(e)}"}
