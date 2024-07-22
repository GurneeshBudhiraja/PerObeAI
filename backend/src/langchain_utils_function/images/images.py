from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
import os
from model.cloth_tag import Cloth_Image_Tag
from model.cloth_description import Cloth_Image_Description
from model.astra_db import VectorStore
from langchain_core.documents import Document


try:
    from .helpers import helpers
except ImportError:
    from helpers import helpers

## Load the environment variables
load_dotenv()


def main(images_url: list[dict], user_id: str) -> list[dict]:
    try:
        # List to store the image data
        images_documents = []

        # Loop through the image URLs
        for image_url in images_url:
            # Get the image data
            image_data = helpers._get_image_data(image_url=image_url["url"])

            # Get the tag for the image
            image_tag = _get_image_tag(image_data=image_data)

            # Check the tag of the image
            is_valid_image = helpers._check_tag(tag=image_tag)

            # Skip the image if the tag is 'none'
            if not is_valid_image:
                print(f"Item is of {image_tag['tag']}")
                continue

            # Generate the description of the image if the tag is "upperwear" or "lowerwear"
            image_description = _get_image_description(image_data=image_data)
            if not image_description:
                raise ValueError("Error in generating the image description")

            # Combine the image URL, tag, and description into a Document for the _store_embeddings function
            image_doc = Document(page_content=image_description["description"], metadata={"tag": image_tag["tag"], "image_url": image_url["url"]})

            # Append the image document to the list
            images_documents.append(image_doc)

        ## making and storing the embeddings
        did_store = _store_embeddings(images_documents=images_documents, user_id=user_id)
        if not did_store:
            raise ValueError("Error in storing the embeddings")
        return True
    
    except Exception as e:
        print(f"Error in images.py/main: {str(e)}")
        return []


## function to get the tag for the image
def _get_image_tag(image_data) -> str:
    try:
        ## defining the model
        model = ChatGoogleGenerativeAI(model="gemini-1.5-flash",temperature=0,transport="grpc")

        ## model class for the structuring the output
        cloth_tag_model = Cloth_Image_Tag

        ## model for the generating the image tags
        parser = JsonOutputParser(pydantic_object=cloth_tag_model) ## Parser for parsing the output

        ## structure for the prompt
        prompt = ChatPromptTemplate.from_messages([
            ("system", "Return the requested response object by following the below instructions\n'{format_instructions}'\n"),
            ("human", [
                {
                "type": "image_url",
                "image_url": f"data:image/jpeg;base64,{image_data}"
                },
            ]),
        ])

        ## chain for the invoking the model
        chain = prompt | model | parser 
        
        ## invoking the chain
        return chain.invoke({"format_instructions": parser.get_format_instructions()})
    
    except Exception as e:
        return {"error": f"Error in _get_image_tag: {str(e)}"}

## function for the description for the image
def _get_image_description(image_data: str)-> dict:
    model = ChatGoogleGenerativeAI(model="gemini-1.5-flash",temperature=0.75,transport="grpc")

    ## model class for the structuring the output
    cloth_description_model = Cloth_Image_Description

    parser = JsonOutputParser(pydantic_object=cloth_description_model) ## Parser for parsing the output


    prompt = ChatPromptTemplate.from_messages([
        ("system", "Return the requested response object by following the below instructions\n'{format_instructions}'\n"),
        ("human", [
            {
            "type": "image_url",
            "image_url": f"data:image/jpeg;base64,{image_data}",
            },
        ]),
    ])
    chain  = prompt | model | parser 

    ## invoking the chain
    image_description = chain.invoke({"format_instructions": parser.get_format_instructions()})
    return image_description


def _store_embeddings(images_documents: list[dict], user_id: str) -> bool:
    try:
        vector_store = VectorStore(user_id=user_id)
        indexes = vector_store.add_documents(images_documents)
        print(f"Indexes: {indexes}")
        if(indexes == []):
            return False
        return True
    except Exception as e:
        print(f"Error in _store_embeddings: {str(e)}")
        return False


if __name__=="__main__":
    pass