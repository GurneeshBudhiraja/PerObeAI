from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from constants import FLASH_MODEL_001
from models.recommend_outfit import RecommendOutfit


def generate_recommendation(upperwer_collection : list[dict],lowerwear_collection:list[dict],user_prompt:str, accessibility)->RecommendOutfit:
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
      ("human", upperwer_collection),
      ("human", lowerwear_collection),
      ("human", "user prompt is {user_prompt} user's accessibility type is {accessibility}"),

    ])

    model = ChatGoogleGenerativeAI(model=FLASH_MODEL_001, temperature=0.75)

    chain = prompt | model | parser 
    
    chain_response = chain.invoke({
      "format_instructions": parser.get_format_instructions(),
      "user_prompt": user_prompt,
      "accessibility":accessibility
    })

    print(f"chain_response: {chain_response}")

    return chain_response
  except Exception as e:
    return {"error": f"Exception in generate_recommendation {str(e)}"}