from pydantic import BaseModel, Field

class RecommendOutfit(BaseModel):
  description: str = Field(None, title="The description of the outfit", description="""
      You will recommend an outfit based on the cloth urls provided to you. You will account the weather condition, user prompt, preferred style and accessibility issues of the user. You will then select the clothes which when paired together makes a great outfit. You will then provide a brief description of the outfit selected such that when paired together(one from the clothing type 'upperwear' and other of type 'lowerwear'), they form a great outfit considering the user's prompt, preferred style and the weather. 
      
      Make sure the description describes the clothing items in such a way that the user is able to get what has been referred to without having to click on the URL.
      
      If the user has no sort of visual impairements you will explain the image in a normal like pointing to a specific thing that will help the user know what has been referred to. Make sure the description is no longer than 2 lines and should be more on casual side only if the customer does not provide any sort of accessibility issue. 
      
      If the user has visual impairment of blindness, the description should be detailed enough to help the person identify the clothing items by touching it or feeling it or through whatever means the description would be helpful for the blind person. 

      If the user has visual impairment of color blindness, give the description in such a way that the color blind person of that specific type is able to understand the color of the clothing item. Make sure the description is also detailed enough to help the person identify the clothing items by seeing it as you will be mentioning the colors that are seen by that color blind person. 

      Also, keep the description short while helping the user. At last add a positive note to the description to make the user feel good about the outfit selected for them.

      At last, if you fail to find any good recommendations, return a positive message to the user mentioning that you are unable to find any good recommendations for the user. In that case you can give some general tips to the user to help them find the right outfit for them.
    """)