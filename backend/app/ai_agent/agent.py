from langchain_google_vertexai import ChatVertexAI
from .cloth_retrieval_agent import ClothesRetrievalAgent
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.tools import tool
from langchain.agents import create_tool_calling_agent, AgentExecutor
from .agent_tools import retrieve_upperwear, retrieve_lowerwear,invalid_request, format_return_data


def agent(user_id:str, user_prompt:str)->list:
  try:

    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a fashion agent. Use the available tools to complete the user's request. You will always use the provided tools to answer the question. If the query can not be answered using the tools you will politely decline the request use the 'invalid_request' tool to return the proper output. For example, if the user has asked something which resembles something regarding the recommendation of clothing, you can use the 'retrieve_upperwear' and 'retrieve_lowerwear' tools to retrieve the clothing items and then use the 'format_return_data' tool to format the data and return it to the user."),
        ("human", "{user_prompt} and user_id is {user_id}"),
        ("placeholder","{agent_scratchpad}")
    ])

    tools = [retrieve_upperwear, retrieve_lowerwear, invalid_request, format_return_data]

    llm = ChatVertexAI(model_name="gemini-1.5-flash-001",temperature=0.15)

    agent = create_tool_calling_agent(prompt=prompt, tools=tools, llm=llm)

    agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)


    agent_response = agent_executor.invoke({"user_prompt": user_prompt,"user_id":user_id})

    print(f"Agent response: \n {agent_response}")
    return agent_response
  except Exception as e:
    # TODO: will handle the error later on with proper logging and custom class
    return f"Exception in agent: {str(e)}"


