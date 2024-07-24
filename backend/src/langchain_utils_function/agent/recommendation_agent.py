## creating the agent for the recommendation
from custom_tools import retrieve_lowerwear,retrieve_upperwear,gemini_recommendation, get_embeddings
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.agents import AgentExecutor, create_tool_calling_agent
import os
from dotenv import load_dotenv
load_dotenv()

## llm for the agent tasks :: will replace this with vertexai agent
llm = ChatOpenAI(model="gpt-3.5-turbo-0125",api_key=os.environ.get("OPENAI_API_KEY"))


## function to be called from the router
def _recommend(user_prompt:str, user_id:str):
  try:
    if not user_prompt or not user_id:
      raise Exception("User id and prompt are required")
    prompt = ChatPromptTemplate.from_messages(
      [
        ("system", "You are a powerful AI agent that will help with the outfit recommendation. You can only use the tools provided to you. For recommending the outfit you will retrieve the results of both upperwear and lowerwear tools and then generate the recommendation using the gemini_recommendation tool. Please follow the human instructions carefully."),
        ("human","user_prompt is {user_prompt} and the user_id is {user_id}"),
        ("placeholder","{agent_scratchpad}")
      ]
    )
    tools=[retrieve_upperwear,retrieve_lowerwear,gemini_recommendation,get_embeddings]  
    agent = create_tool_calling_agent(llm,tools,prompt)
    agent_executor = AgentExecutor(agent=agent,tools=tools,verbose=True)
    agent_resp = agent_executor.invoke({"user_prompt":user_prompt,"user_id":user_id})
    print(f"Agent Resp at the end of the process is: {agent_resp}")
  except Exception as e:
    return str(e)
  


if __name__=="__main__":
  recommendation = _recommend("What I should wear at the beach today","JKVDl1ErPjaj3TPRNuBUsN3W9xS2")
  print(recommendation)
