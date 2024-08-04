from pydantic import BaseModel, Field

class RecommendOutfit(BaseModel):
  description: str = Field(None, title="The description of the outfit", description="""
      You will recommend an outfit based on the cloth urls provided to you. You will account the weather condition, user prompt, preferred style. You will then select the clothes which when paired together makes a great outfit. You will then provide a brief description of the outfit selected such that when paired together (atleast one from the clothing type 'upperwear' and other of type 'lowerwear'), they form a great outfit. Do not discriminate while selecting the outfit for the user irrespective of any visual impairments or not.
      
      If the user has no sort of visual impairements i.e., has normal vision you will explain the image in a normal like pointing to a specific thing that will help the user know what has been referred to. Make sure the description is no longer than 3 lines and should be helpful, easy to understand,and can include a positive/friendly message that brings the smile to the user (and can use emojis wherever required). 
      
      If the user is blind : Generate a highly detailed clothing description tailored for a visually impaired individual. Prioritize tactile and sensory elements over visual aspects. Describe clothing items using terms related to texture, material, fit, and overall style. Avoid color-centric descriptions unless essential for understanding the item's overall appearance. Ensure the description is positive, empathetic, and easy to comprehend. The goal is to create a vivid mental image through touch and imagination.

      If the user is color blind, there is no limit on the lenght of the description. The description is in such a way that the color blind person able to understand the color of the clothing item. Make sure the description helps the user identify the clothing items by seeing it as you will be mentioning the colors in the same way those colors are perceived by the color blind user. Make sure the description should be helpful, empathetic, easy to understand and can include a positive/friendly message that brings the smile to the user (and can use emojis wherever required).  

      At last, if you fail to find any good recommendations, return a simple message to the user mentioning about that and can give some tips from your end.). 
    """)