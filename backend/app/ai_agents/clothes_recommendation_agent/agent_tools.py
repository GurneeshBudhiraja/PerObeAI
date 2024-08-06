from langchain_core.tools import tool, ToolException
from app.ai_handlers import embed_text, generate_recommendation
from app.vector_store import VectorStore
from .agent_utils import format_clothes_data
from app.constants import BASE_URL, TOP_K
import requests
import os
from app.errors.custom_exception import CustomException

# Global variables to store the upperwear and lowerwear clothes data fetched from the vector store
UPPERWEAR_CLOTHES = []
LOWERWEAR_CLOTHES = []


@tool
def get_temperature_by_city(city: str) -> dict:
    """
    Gets the temperature by city name using the OpenWeatherMap API

    Args:
      city : str : The city name.

    Returns:
      dict : The temperature data is successfully fetched from the API otherwise an empty dictionary

    """

    try:

        URL = BASE_URL + "q=" + city + "&appid=" + os.getenv("WEATHER_API_KEY")

        weather_data = requests.get(URL).json()

        return weather_data

    except Exception as e:

        raise ToolException(f"get_temperature_by_city agent tool error: {e}")


@tool
def retrieve_upperwear(user_id: str, user_prompt: str) -> bool:
    """
    Retrieves the list of upperwear clothes based on the user prompt, formats the data to the proper format and assings to the global variable UPPERWEAR_COLLECTION

    Args:
      user_prompt : str : The user prompt.
      user_id : str : The user id.

    Returns:
      True : bool = A boolean value to indicate the success of the tool
    """
    try:

        global UPPERWEAR_CLOTHES

        text_embedding = embed_text(text=user_prompt)

        filter_criteria = {"tag": "upperwear"}

        vector_store_instance = VectorStore(user_id=user_id)

        upperwear_data = vector_store_instance.fetch_similar_vectors(
            vector_list=text_embedding,
            top_k=TOP_K,
            filter=filter_criteria,
            include_metadata=True,
        )

        UPPERWEAR_CLOTHES = format_clothes_data(clothes_data=upperwear_data)

    except Exception as e:

        raise ToolException(f"retrieve_upperwear agent tool error: {e}")


@tool
def retrieve_lowerwear(user_id: str, user_prompt: str) -> bool:
    """
    Retrieves the list of lowerwear clothes based on the user prompt, formats the data to the proper format and assings to the global variable LOWERWEAR_COLLECTION

    Args:
      user_prompt : str : The user prompt.
      user_id : str : The user id.

    Returns:
      True : bool = A boolean value to indicate the success of the tool otherwise False
    """
    try:

        global LOWERWEAR_CLOTHES

        text_embedding = embed_text(text=user_prompt)

        filter_criteria = {"tag": "lowerwear"}

        vector_store_instance = VectorStore(user_id=user_id)

        lowerwear_data = vector_store_instance.fetch_similar_vectors(
            vector_list=text_embedding,
            top_k=TOP_K,
            filter=filter_criteria,
            include_metadata=True,
        )

        LOWERWEAR_CLOTHES = format_clothes_data(clothes_data=lowerwear_data)

        return True

    except Exception as e:

        raise ToolException(f"retrieve_lowerwear agent tool error: {e}")


@tool(return_direct=True)
def generate_outfit_recommendation(
    user_prompt: str, accessibility: str
) -> dict | CustomException:
    """
    Get the final recommendation based on the upperwear and lowerwear data fetched from the vector store

    Args:
      user_prompt : str : The user prompt
      accessibility : str : The accessibility of the user like 'blind', 'color blindness of some type', or any other type of visual impairment

    Returns:
      dict : The final recommendation based on the upperwear and lowerwear clothes data otherwise a dictionary otherwise a custom exception
    """

    try:

        return generate_recommendation(
            upperwer_clothes=UPPERWEAR_CLOTHES,
            lowerwear_clothes=LOWERWEAR_CLOTHES,
            user_prompt=user_prompt,
            accessibility=accessibility,
        )

    except Exception as e:

        raise ToolException(f"generate_outfit_recommendation agent tool error: {e}")
