from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.pydantic_v1 import BaseModel, Field
from langchain_google_genai import ChatGoogleGenerativeAI
import base64, requests
from dotenv import load_dotenv

# loading the environment variables
load_dotenv()


# give the tags based on the clothing item
def _get_cloth_tag(cloth_url:str):
    try:
        image_data = base64.b64encode(requests.get(cloth_url).content).decode("utf-8")
        if not image_data:
            raise Exception("Error in fetching image data")
        model = ChatGoogleGenerativeAI(model="gemini-1.5-flash",transport="grpc")
        # Define a Pydantic model to parse the model's output
        class Text(BaseModel):
            tag: str = Field(title="Tags",description="Give a tag to an image either upperwear or lowerwear depending on the clothing item shown in the image. If the image does not contain a piece of clothing then give the tag as 'null'.")

        parser = JsonOutputParser(pydantic_object=Text)

        prompt = ChatPromptTemplate.from_messages([
            ("system", "Return the requested response object by following the below instructions\n'{format_instructions}'\n"),
            ("human", [
                {
                    "type": "image_url",
                    "image_url": {"url":f"data:image/jpeg;base64,{image_data}"},
                },
            ]),
        ])

        chain = prompt | model | parser

        # Run the chain and print the result
        print("Running the chain...")
        tag_chain_resp= (chain.invoke({
            "language": "English",
            "format_instructions": parser.get_format_instructions(),
        }))
        print("Chain completed.")
        return tag_chain_resp
    except Exception as e:
        return {"error":e}
    

if __name__ == "__main__":
    print("images.py")