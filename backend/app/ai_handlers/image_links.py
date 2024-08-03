from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

from constants import FLASH_MODEL_001, PRO_MODEL_001
from models.image_links_model import ImageLinks


def get_image_links(description:str, cloth_collections_data:list[dict], is_repeat:bool=False)->dict:
  """
  Function to extract the image links from cloth_collections_data based on the description provided

  Args:
    description : str : The description of the outfit
    cloth_collections_data : list[dict] : The cloth collection data fetched from the vector store based on the user prompt

  Returns:
    dict : The image links of the clothing items based on the description provided and the description of the clothing items
  """
  try:
    parser = JsonOutputParser(pydantic_object=ImageLinks)


    prompt = ChatPromptTemplate.from_messages([
      ("system", "Return the requested response object by following the below instructions\n'{format_instructions}'\n"),
      ("human", "{description}"),
      ("human", "{image_urls}"),
    ])

    model = ChatGoogleGenerativeAI(model=FLASH_MODEL_001, temperature=1)


    chain = prompt | model | parser 
    if not is_repeat:
      image_urls_list=cloth_collections_data["upperwear_collection"] + cloth_collections_data["lowerwear_collection"]

    chain_response = chain.invoke({
      "format_instructions": parser.get_format_instructions(),
      "description": description,
      "image_urls": image_urls_list
    })
    chain_response["description"]=description
    if not is_repeat:
      chain_response["image_urls"]=image_urls_list
    return chain_response
  except Exception as e: 
    # TODO: will add the error handling later on
    return {"error": f"Exception in image_links {str(e)}"}