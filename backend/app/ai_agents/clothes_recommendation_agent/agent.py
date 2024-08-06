from langchain_google_vertexai import ChatVertexAI
from langchain_core.prompts import ChatPromptTemplate
from langchain.agents import create_tool_calling_agent, AgentExecutor

from ai_agents.clothes_recommendation_agent.agent_tools import (
    retrieve_upperwear,
    retrieve_lowerwear,
    get_temperature_by_city,
    generate_outfit_recommendation,
)
from app.constants import FLASH_MODEL_001
from utils import logger

# Custom package to store the prompts
from ai_prompts import AGENT_SYSTEM_PROMPT


def clothes_recommendation_agent(
    user_id: str,
    user_prompt: str,
    city: str,
    accessibility: str,
    preferred_fashion_style: str | None = None,
) -> dict:
    try:
        """
        Agent to generate the outfit recommendation for the user based on the user's preferences and the city's weather.

        Args:
          user_id : str : The user's firebase id.
          user_prompt : str : The user's prompt.
          city : str : The city name.
          accessibility : str : The user's accessibility type.
          preferred_fashion_style : str : The user's preferred fashion style.

        Returns:
          dict : The outfit recommendation otherwise an error.

        """
        prompt = ChatPromptTemplate.from_messages(
            [
                ("system", AGENT_SYSTEM_PROMPT),
                (
                    "human",
                    "{user_prompt} ,user_id is {user_id} ,the city is {city}, user's fashion style is     {preferred_fashion_style} and the user's accessibility type is {accessibility}",
                ),
                ("placeholder", "{agent_scratchpad}"),
            ]
        )

        agent_tools = [
            get_temperature_by_city,
            retrieve_upperwear,
            retrieve_lowerwear,
            generate_outfit_recommendation,
        ]

        llm = ChatVertexAI(model_name=FLASH_MODEL_001, temperature=0)

        agent = create_tool_calling_agent(llm=llm, prompt=prompt, tools=agent_tools)

        # TODO: remove verbose=True later on
        agent_executor = AgentExecutor(agent=agent, tools=agent_tools, verbose=True)

        agent_response = agent_executor.invoke(
            {
                "user_prompt": user_prompt,
                "user_id": user_id,
                "city": city,
                "preferred_fashion_style": preferred_fashion_style,
                "accessibility": accessibility,
            }
        )

        return agent_response["output"]

    except Exception as e:
        raise Exception(f"Agent Error: {e}")
