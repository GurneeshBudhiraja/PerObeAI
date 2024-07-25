from langchain_core.output_parsers import JsonOutputParser
from uuid import uuid4
import logging
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_google_vertexai import VertexAIEmbeddings
from dotenv import load_dotenv
import os
from model.cloth_tag import Cloth_Image_Tag
from model.cloth_description import Cloth_Image_Description
from model.astra_db import VectorStore
from langchain_core.documents import Document
from pinecone_vector_db.pinecone_class import PineconeClass

try:
    from .helpers import helpers
except ImportError:
    from helpers import helpers

## Load the environment variables
load_dotenv()


def main(images_url: list[dict], user_id: str) -> list[dict]:
    try:
        # List to store the image data
        images_vector = []

        # Loop through the image URLs
        for image in images_url:
            image_url = image["url"]
            print(f"Image URL :: {image_url}")
            # Get the image data
            print("Generating the image data")
            image_data = helpers._get_image_data(image_url=image_url)
            # Get the tag for the image
            image_tag = _get_image_tag(image_data=image_data)
            print(f"Image tag generated for the image :: {image_tag}")
            # Check the tag of the image
            is_valid_image = helpers._check_tag(tag=image_tag)

            # Skip the image if the tag is 'none'
            if not is_valid_image:
                print(f"Item is of {image_tag['tag']}")
                continue
            
            # Generate the vector of the image
            image_vector = generate_image_vector(image_url=image_url)
            print(f"Image vector generated for the image :: {len(image_vector)} :: {image_vector[:5]}")
            if not image_vector:
                raise ValueError("Error in generating the image description")

            image_doc_id = str(uuid4())
            metadata={
                "url":image_url,
                "tag":image_tag["tag"],
            }
            image_vector_dict={
                "id":image_doc_id,
                "values":image_vector,
                "metadata":metadata,
            }
            images_vector.append(image_vector_dict)
        ## storing the embeddings list in the vector db
        pinecone_class_instance = PineconeClass(user_id=user_id)
        pinecone_insert_resp = pinecone_class_instance.insert_vectors(images_vector=images_vector)
        logging.info(f"The vectors have been stored in the db :: {pinecone_insert_resp}")
        return pinecone_insert_resp
    
    except Exception as e:
        logging.error(f"Error in main: {str(e)}")
        return []


## function to get the tag for the image
def _get_image_tag(image_data) -> str:
    try:
        ## defining the model
        model = ChatGoogleGenerativeAI(model="gemini-1.5-flash",temperature=0,transport="grpc")

        ## model for the generating the image tags
        parser = JsonOutputParser(pydantic_object=Cloth_Image_Tag) ## Parser for parsing the output

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


## function to generate the vector of the image
def generate_image_vector(image_url:str)->list[float]:
    embedding_model = VertexAIEmbeddings(model_name="multimodalembedding")
    image_vector = embedding_model.embed_image(image_path=image_url)
    return image_vector

## function for the description for the image
def _get_image_description(image_data: str)-> dict:
    try:
        model = ChatGoogleGenerativeAI(model="gemini-1.5-flash",temperature=0.50,transport="grpc")

        parser = JsonOutputParser(pydantic_object=Cloth_Image_Description) ## Parser for parsing the output


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
    except Exception as e:
        print(f"exception is {e}")

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
    main(images_url=[
        {"url":"https://firebasestorage.googleapis.com/v0/b/perobeai-430021.appspot.com/o/JKVDl1ErPjaj3TPRNuBUsN3W9xS2%2F7shirtPattern2294c986-52a7-498f-a0df-6f4f7805d209.png?alt=media&token=0b2d42a1-f077-4a05-91fd-374ecb4aebdf"}
    ])