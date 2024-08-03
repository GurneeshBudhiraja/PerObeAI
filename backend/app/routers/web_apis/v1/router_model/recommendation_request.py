from fastapi import Body 
from pydantic import BaseModel, Field
from firebase_utils import verify_firebase_uid
from typing import Optional



class RecommendationBody(BaseModel):
  preferred_fashion_style:str = Field(None, description="The preferred fashion style of the user.")
  city:str = Field(..., description="The city of the user.")
  user_prompt:str = Field(..., description="The user prompt.")
  accessibility:str = Field(None, description="The accessibility of the user.")
