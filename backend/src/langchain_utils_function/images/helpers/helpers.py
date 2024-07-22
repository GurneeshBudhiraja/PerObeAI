from langchain_google_genai import GoogleGenerativeAIEmbeddings
import base64, requests


## function to check the tag of the image provided
def _check_tag(tag: dict):
    if(tag["tag"]=="none"):
        return False
    elif tag["tag"] in ["upperwear","lowerwear"]:
        return True

## generate embeddings from the function
def _generate_image_description_embeddings(description: dict):
    ## Google embedding model
    embeddings_model = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    return embeddings_model.embed_query(description["brief_description"])


## function to get the image data from the image url
def _get_image_data(image_url: str)->str:
    image_data =  base64.b64encode(requests.get(image_url).content).decode("utf-8")
    return image_data

if __name__=="__main__":
    pass
