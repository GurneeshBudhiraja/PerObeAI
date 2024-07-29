from langchain_google_vertexai import ChatVertexAI, VertexAIEmbeddings,VertexAI
from langchain.tools import tool
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pinecone_vector_db.pinecone_class import PineconeClass
from dotenv import load_dotenv
from model.recommendation_output import RecommendedOutfit

load_dotenv()
## GLOBAL VARIABLES
LOWERWEAR_COLLECTION=[]
UPPERWEAR_COLLECTION=[]

def _retrieve_clothes(user_id:str,user_prompt:str,accessibility:str="none"):
  # llm = ChatVertexAI(model_name="gemini-1.5-flash-001	",temperture=1, top_p=0.50) # model for the agent
  llm = ChatVertexAI(model_name="gemini-1.5-flash-001") ## llm for the agent
  prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a powerful AI bot whose job is to fetch the data. When the user asks for a recommendation, you will first use the tools 'retrieve_upperwear' and 'retrieve_lowerwear' to fetch the top 4 upperwear and lowerwear vectors closest. End the chain my mentioning the clothing item links you fetched and end it with a positive note."),
    ("human","user_prompt is {user_prompt} and the user_id is {user_id}"),
    ("placeholder","{agent_scratchpad}")
  ])
  """TOOLS"""
  @tool
  def retrieve_upperwear(user_id:str,user_prompt:str)->list[dict]:
    """fetches the top 4 upperwear vectors closest to the vector of the prompt_vector from the pinecone db vector store"""
    try:
      pinecone_instance = PineconeClass(user_id=user_id)
      embeddings = get_text_vector(user_prompt=user_prompt)
      upperwear_results = pinecone_instance.fetch_similar_vectors(vector_list=embeddings,top_k=4,filter={"tag":"upperwear"},include_metadata=True)["matches"]
      upperwear_items = [{"type":"image_url","image_url":result["metadata"]["url"]} for result in upperwear_results]
      global UPPERWEAR_COLLECTION
      UPPERWEAR_COLLECTION = upperwear_items
      return
    except Exception as e:
      print(f"Error in get_similar_clothing_items tool: {str(e)}")

  @tool
  def retrieve_lowerwear(user_id:str,user_prompt:str)->list[dict]:
    """fetches the top 4 lowerwear vectors closest to the vector of the prompt_vector from the pinecone db vector store"""
    try:
      pinecone_instance = PineconeClass(user_id=user_id)
      embeddings = get_text_vector(user_prompt=user_prompt)
      lowerwear_results = pinecone_instance.fetch_similar_vectors(vector_list=embeddings,top_k=4,filter={"tag":"lowerwear"},include_metadata=True)["matches"]
      lowerwear_items = [{"type":"image_url","image_url":result["metadata"]["url"]} for result in lowerwear_results]
      global LOWERWEAR_COLLECTION
      LOWERWEAR_COLLECTION = lowerwear_items
      return
    except Exception as e:
      print(f"Error in get_similar_clothing_items tool: {str(e)}")
  # tools list
  tools=[retrieve_upperwear,retrieve_lowerwear]
  
  # agent
  agent=create_tool_calling_agent(llm=llm,tools=tools,prompt=prompt)
  # agent_executor
  agent_executor=AgentExecutor(agent=agent,tools=tools,verbose=False)
  # invoke the agent
  agent_executor.invoke({"user_prompt":user_prompt,"user_id":user_id}) 

  get_recommendation(user_prompt=user_prompt,lowerwear_collection=LOWERWEAR_COLLECTION, upperwear_collection=UPPERWEAR_COLLECTION,accessibility=accessibility)  

def get_recommendation(user_prompt:str,lowerwear_collection:list,upperwear_collection:list,accessibility:str)->dict:
  llm = VertexAI(model_name="gemini-1.5-flash",temperature=1.25)
  parser = JsonOutputParser(pydantic_object=RecommendedOutfit)
  prompt = ChatPromptTemplate.from_messages([
            ("system", "You are a helpful bot that helps the user recommend outfit based on the user's collection. You do not have to provide responses out of your knowledge base. Yo only have to look at the user's collection and give the output by following the {format_instructions}."),
            ("human", "{user_prompt} and temperature outside is {temperature}"),
            ("ai","I will surely help you with that. Please provide me with the lowerwear_collection first whenever you are ready.😀"),
            ("human", lowerwear_collection),
            ("ai","Please provide me with the upperwear_items and I will return the text along with links from both the upperwear and lowerwear collection. Provide me with the upperwear collection whenever you are ready.😀"),
            ("human", upperwear_collection)
    ])
  chain = prompt | llm | parser

  # tools 
  @tool
  def recommend_outfit(user_prompt:str,temperature:str):
    """returns the urls of the outfits"""
    
    recommended_outfit = chain.invoke({"user_prompt":user_prompt,"format_instructions":parser.get_format_instructions(),"temperature":temperature})
    return recommended_outfit


  @tool
  def get_temperature(city:str):
    """use the city name to get the temperature"""
    return "-20 degrees"
  
  tools= [recommend_outfit,get_temperature]

  model  = ChatVertexAI(model_name="gemini-1.5-pro",temperature=0.35)
  prompt=ChatPromptTemplate.from_messages([
    ("system","You are a helpful bot that uses the proper tools which help the user generate proper outfits. You do not have to provide responses out of your knowledge base. You only have to use the tools provided to generate the recommendation for the user. The tools already have access to all the data required stored in the db. You will just return a positive message at the end along with URLs of the clothes like mentioning something positive or related to the user prompt, giving a tip about the clothes selected or anything from your end to make it sound friendly and fun wherever required. P.s. if the city is not provided by the user you can consider the temperature to be 'not provided'"),
    ("human","{user_prompt}"),
    ("placeholder","{agent_scratchpad}")
  ])

  agent = create_tool_calling_agent(llm=model,tools=tools,prompt=prompt)
  agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)
  resp = agent_executor.invoke({"user_prompt":user_prompt})
  print("Resp from recommendation agent",resp)


# generate the embeddings of the text vector
def get_text_vector(user_prompt:str)->list[float]:
  """Will accept the user input and will return the vector of the user input"""
  embedding_model = VertexAIEmbeddings(model_name="multimodalembedding")
  image_vector = embedding_model.embed_query(text=user_prompt)
  return image_vector

if __name__ == "__main__":
  _retrieve_clothes(user_id="JKVDl1ErPjaj3TPRNuBUsN3W9xS2",user_prompt="beach date night in Toronto",accessibility="none")
