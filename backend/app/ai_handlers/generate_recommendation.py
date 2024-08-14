from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from app.constants import FLASH_MODEL_001
from app.models.recommend_outfit import RecommendOutfit


def generate_recommendation(
    upperwer_clothes: list[dict],
    lowerwear_clothes: list[dict],
    user_prompt: str,
    accessibility: str = "",
) -> RecommendOutfit:
    """
    Function to generate the recommendation based on the user prompt and cloth collection data fetched from the vector store

    Args:
    upperwear_clothes : list[dict] : The list of upperwear clothes
    lowerwear_clothes : list[dict] : The list of lowerwear clothes

    user_prompt : str : The user prompt

    accessibility : str : The accessibility of the user like 'blind', 'some type of color blindness', or any other type of visual impairment
    """

    try:
        parser = JsonOutputParser(pydantic_object=RecommendOutfit)

        prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "Return the requested response object by following the below instructions\n'{format_instructions}'\n",
                ),
                ("human", upperwer_clothes),
                ("human", lowerwear_clothes),
                (
                    "human",
                    "user prompt is {user_prompt} user's accessibility type is {accessibility}",
                ),
            ]
        )

        model = ChatGoogleGenerativeAI(model=FLASH_MODEL_001, temperature=0.65)

        chain = prompt | model | parser

        return chain.invoke(
            {
                "format_instructions": parser.get_format_instructions(),
                "user_prompt": user_prompt,
                "accessibility": accessibility,
            }
        )

    except Exception as e:
        raise Exception("Error in generating recommendation")
