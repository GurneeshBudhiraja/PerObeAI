from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnableLambda
from langchain_core.pydantic_v1 import BaseModel, Field
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
import base64, requests
try:
    from .helpers import helpers
except ImportError:
    from helpers import helpers

## Load the environment variables
load_dotenv()


## model for the generating the image descriptions
GEMINI_FLASH_MODEL = ChatGoogleGenerativeAI(model="gemini-1.5-flash",temperature=0.75,transport="grpc")


## function to get the tag of the image
def _get_image_tag(image_url: str):
    try:
        ## getting the image data
        image_data = base64.b64encode(requests.get(image_url).content).decode("utf-8")

        ## defining the pydantic model for the structuring the output
        class Cloth_Image_Tag(BaseModel):
            tag: str = Field(title="Tag",description="The tag of the clothing item in the image provided. Give the tag 'upperwear' for the items that are worn on the upper body and 'lowerwear' for the items that are worn on the lower body. Give the tag 'none' for the items that are not worn on the body.")
        
        ## model for the generating the image tags
        parser = JsonOutputParser(pydantic_object=Cloth_Image_Tag)

        ## structure for the prompt
        prompt = ChatPromptTemplate.from_messages([
            ("system", "Return the requested response object by following the below instructions\n'{format_instructions}'\n"),
            ("human", [
                {
                "type": "image_url",
                "image_url": f"data:image/jpeg;base64,{image_data}", ## will pass the image data on the invoke of the chain
                },
            ]),
        ])
        chain = prompt | GEMINI_FLASH_MODEL | parser | RunnableLambda(helpers._check_tag)
        should_proceed = chain.invoke({"format_instructions": parser.get_format_instructions()})
        if(should_proceed!="proceed"):
            return should_proceed
        else:
            return _get_image_description(image_data=image_data)
    except Exception as e:
        return {"error": "Error in getting the image tag"}

## function for the description of the image
def _get_image_description(image_data: str):
    ## defining the pydantic model for the structuring the output
    class Cloth_Image_Description(BaseModel):
        brief_description: str = Field(title="Brief Description",description=f"Give a brief description of the clothing item in the image provided in no more than 300 words making sure there is no repeatability and mentioning all the unique attributes of the clothing item shown in the image. The details should include the color, patter, type of clothing item, ideal weather/temperature to wear the clothing item, the occasion to wear the clothing item, material and feel of the item, is it a casual or formal wear, and any extra details that you think are important for the model to pair the clothing item with other items. Make sure to add some unique datapoints from the image that would help to understand the clothing item better.")

    parser = JsonOutputParser(pydantic_object=Cloth_Image_Description) ## Parser for parsing the output

    prompt = ChatPromptTemplate.from_messages([
        ("system", "Return the requested response object by following the below instructions\n'{format_instructions}'\n"),
        ("human", [
            {
            "type": "image_url",
            "image_url": f"data:image/jpeg;base64,{image_data}", ## will pass the image data on the invoke of the chain
            },
        ]),
    ])
    chain  = prompt | GEMINI_FLASH_MODEL | parser | RunnableLambda(helpers._generate_image_description_embeddings)

    ## invoking the chain
    image_embeddings = chain.invoke({"format_instructions": parser.get_format_instructions()})
    if not image_embeddings:
        return {"error": "Error in generating the image embeddings"}
    return "image_embeddings generated"


if __name__=="__main__":
    print(_get_image_tag("https://firebasestorage.googleapis.com/v0/b/perobeai-c5788.appspot.com/o/belt.png?alt=media&token=da51c79b-00ba-493b-b126-19f97f8e17a9"))
