from langchain_google_vertexai import ChatVertexAI
from langchain_core.prompts import ChatPromptTemplate
from langchain.agents import create_tool_calling_agent, AgentExecutor
from .agent_tools import retrieve_upperwear, retrieve_lowerwear, format_return_data, get_temperature_by_city, generate_outfit_recommendation
from constants import FLASH_MODEL_001

def agent(user_id:str, user_prompt:str, city:str, accessibility:str, preferred_fashion_style:str|None=None)->list:
  try:

    prompt = ChatPromptTemplate.from_messages([
      ("system", """You are a fashion agent which uses the available tools and make parallel tool calls to complete the user's request. Your only task is to retrive data from the tools and return the output without adding anything or removing from your end. You will extract all the important points from the user prompt and construct a new prompt for the tools for better retrievals from the vector store. If there is any temperature mentioned in the user prompt convert that temperature number to a word like cold, warm or any suitable word for that weather. Do also add the user's fashion style preference in the new prompt. Summarize the user's fashion style in a few words for the better retrieval of the clothes.

      
      The new prompt should only contain relevant info like occasion, weather, etc and not the things which are used by the user to consruct a sentence.
      
      """),

      ("human", "{user_prompt} ,user_id is {user_id} ,the city is {city}, user's fashion style is   {preferred_fashion_style} and the user's accessibility type is {accessibility}"),
        
      ("placeholder","{agent_scratchpad}")
    ])

    tools = [get_temperature_by_city ,retrieve_upperwear, retrieve_lowerwear,format_return_data, generate_outfit_recommendation]

    llm = ChatVertexAI(model_name=FLASH_MODEL_001,temperature=0)

    agent = create_tool_calling_agent(llm=llm, prompt=prompt, tools=tools)

    # TODO: remove verbose=True later on
    agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

    agent_response = agent_executor.invoke({"user_prompt": user_prompt,"user_id":user_id,"city":city,"preferred_fashion_style":preferred_fashion_style,"accessibility":accessibility})

    return agent_response["output"]
  
  except Exception as e:
    # TODO: will handle the error later on with proper logging and custom class
    return f"Exception in agent"


