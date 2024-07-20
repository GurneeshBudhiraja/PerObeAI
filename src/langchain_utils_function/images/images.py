from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.pydantic_v1 import BaseModel, Field
from langchain_google_genai import ChatGoogleGenerativeAI
import vertexai
import base64, requests,os
from dotenv import load_dotenv

# loading the environment variables
load_dotenv()

# assign the tags based on the clothing item
def _get_cloth_tag(cloth_url:str):
    try:
        image_data = base64.b64encode(requests.get(cloth_url).content).decode("utf-8")
        if not image_data:
            raise Exception("Error in fetching image data")
        model = ChatGoogleGenerativeAI(model="gemini-1.5-flash",transport="grpc")
        
        # Define a Pydantic model to parse the model's output
        class Text(BaseModel):
            tag: str = Field(title="Tags",description="""Give a tag to the clothing item based on the image provided. The tags can be 'upperwear', 'lowerwear', 'null'. Give the tag upperwear if the image is of an upperwear item, lowerwear if the image is of a lowerwear item, and null if the image is not of any clothing item.""")
            brief_description: str = Field(title="Brief Description",description=f"Give a brief description of the clothing item in the image provided in 300 words mentioning all the details of the clothing item. The details should include the color, patter, type of clothing item, ideal weather/temperature to wear the clothing item, the occasion to wear the clothing item, material and feel of the item, is it a casual or formal wear, and any extra details that you think are important for the model to pair the clothing item with other items. ")
            blind_feel:str = Field(title="Blind Description",description="Give a description to the image considering that the person is blind. Guide the blind person how this clothing item feels like mentioning the pattern, texture, material, and feel of the clothing item.")

        parser = JsonOutputParser(pydantic_object=Text)

        prompt = ChatPromptTemplate.from_messages([
            ("system", "Return the requested response object by following the below instructions\n'{format_instructions}'\n"),
            ("human", [
                {
                    "type": "image_url",
                    "image_url": f"data:image/jpeg;base64,{image_data}",
                },
            ]),
        ])
        chain = prompt | model | parser

        # Run the chain and print the result
        print("Running the chain...")
        tag_assign_chain_resp= (chain.invoke({
            "language": "English",
            "format_instructions": parser.get_format_instructions(),
        }))
        print("Chain completed.")
        return tag_assign_chain_resp
    except Exception as e:
        print("Error in _get_cloth_tag: ",e)
        return {"error":e}
    

def _get_cloth_emebeddings(coth_links_list:list[dict]|None=None):
    try:
        pass


    except Exception as e:
        print("Error in _get_cloth_emebeddings: ",e)
        print({"error":e})

if __name__ == "__main__":
    print(_get_cloth_tag("https://firebasestorage.googleapis.com/v0/b/perobeai-c5788.appspot.com/o/SsJbrxuuM2eujS1WurI54FAMj9R2%2FScreenshot%202024-07-18%20at%209fbf3e416-5641-4978-8219-fa6ba5b5e81c.00?alt=media&token=a591e522-125c-4a36-b9cc-82ed825a9f54"))
    # _get_cloth_emebeddings()