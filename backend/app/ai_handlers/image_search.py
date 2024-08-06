from fastapi.responses import JSONResponse
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import ChatPromptTemplate
from constants import FLASH_MODEL_001
from models.fetch_image_from_description import FetchImageFromDescription

def fetch_image_by_description(description:str, clothes_urls:list[dict])->JSONResponse:
  """# TODO: will add the docstrings here"""
  try:
    model = ChatGoogleGenerativeAI(model=FLASH_MODEL_001, temperature=0.20)

    parser = JsonOutputParser(pydantic_object=FetchImageFromDescription)

    prompt = ChatPromptTemplate.from_messages([
      ("system","Format the output by following the below instructions:/n{format_instructions}"),
      ("human",description),
      ("human",clothes_urls)
    ])

    chain = prompt | model | parser

    chain_resp = chain.invoke({
      "format_instructions": parser.get_format_instructions()
    })

    return chain_resp
w
  except Exception as e:
    raise Exception(str(e))