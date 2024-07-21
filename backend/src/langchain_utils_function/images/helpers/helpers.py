from langchain_google_genai import GoogleGenerativeAIEmbeddings

## function to check the tag of the image provided
def _check_tag(tag: dict):
    if(tag["tag"]=="none"):
        return "null"
    elif tag["tag"] in ["upperwear","lowerwear"]:
        return "proceed"

## generate embeddings from the function
def _generate_image_description_embeddings(description: dict):
    ## Google embedding model
    embeddings_model = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    return embeddings_model.embed_query(description["brief_description"])


if __name__=="__main__":
    pass
