from langchain_google_vertexai import ChatVertexAI
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.prompts import ChatPromptTemplate
from langchain.tools import tool
from .agent_tools import retrive_upperwear_clothes, retrive_lowerwear_clothes

def _recommend(**kwargs):
  print("kwargs",kwargs)