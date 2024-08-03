from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.runnables import RunnableLambda

from constants import FLASH_MODEL_001
from models.recommend_outfit import RecommendOutfit
from .image_links import get_image_links

def generate_recommendation(cloth_collections_data : list[dict]|bool, preferred_fashion_style:str,user_prompt:str, accessibility:str=None, weather:str=None)->RecommendOutfit:
  """
  Function to generate the recommendation based on the user prompt and cloth collection data fetched from the vector store

  Args:
  cloth_collections_data : list[dict] : The cloth collection data fetched from the vector store based on the user prompt

  user_prompt : str : The user prompt

  accessibility : str : The accessibility of the user like 'blind', 'some type of color blindness', or any other type of visual impairment
  """

  try:
    parser = JsonOutputParser(pydantic_object=RecommendOutfit)

    prompt = ChatPromptTemplate.from_messages([
      ("system", "Return the requested response object by following the below instructions\n'{format_instructions}'\n"),
      ("human", cloth_collections_data["upperwear_collection"]),
      ("human", cloth_collections_data["lowerwear_collection"]),
      ("human", "user prompt is {user_prompt} and user's preferred style is {preferred_style}, weather is {weather} and the user's accessibility issues are {accessibility}"),
    ])

    model = ChatGoogleGenerativeAI(model=FLASH_MODEL_001, temperature=0.15)

    chain = prompt | model | parser | RunnableLambda(lambda output: get_image_links(description=output.get("description"), cloth_collections_data=cloth_collections_data))

    chain_response = chain.invoke({
      "format_instructions": parser.get_format_instructions(),
      "user_prompt": user_prompt,
      "preferred_style": preferred_fashion_style,
      "weather": weather,
      "accessibility":accessibility
    })

    print(f"chain_response: {chain_response}")

    return chain_response
  except Exception as e:
    return {"error": f"Exception in generate_recommendation {str(e)}"}