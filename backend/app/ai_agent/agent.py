from langchain_google_vertexai import ChatVertexAI
from langchain_core.prompts import ChatPromptTemplate
from langchain.agents import create_tool_calling_agent, AgentExecutor
from .agent_tools import retrieve_upperwear, retrieve_lowerwear,invalid_request, format_return_data
from constants import FLASH_MODEL_001

def agent(user_id:str, user_prompt:str)->list:
  try:

    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a fashion agent which uses the available tools to complete the user's request. Anything asked beyond the scope of the tools will be considered invalid. Also, the output should be formatted using the proper tool in order to maintain the consistency in the output."),
        ("human", "{user_prompt} and user_id is {user_id}"),
        ("placeholder","{agent_scratchpad}")
    ])

    tools = [retrieve_upperwear, retrieve_lowerwear, invalid_request, format_return_data]

    llm = ChatVertexAI(model_name=FLASH_MODEL_001,temperature=0)

    agent = create_tool_calling_agent(llm=llm, prompt=prompt, tools=tools)

    # TODO: remove verbose=True later on
    agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)


    agent_response = agent_executor.invoke({"user_prompt": user_prompt,"user_id":user_id})

    return agent_response
  
  except Exception as e:
    # TODO: will handle the error later on with proper logging and custom class
    return f"Exception in agent: {str(e)}"


