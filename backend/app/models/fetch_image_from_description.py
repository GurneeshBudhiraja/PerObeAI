from pydantic import BaseModel, Field

class FetchImageFromDescription(BaseModel):
  url_list: list[str] = Field(..., description="""
  Context:
  I will provide you with a description of a scene or situation, along with a few image URLs.
  
  Task:
  Carefully read the description and identify which image URLs correspond to the objects or actions mentioned within it.

  Input:
  Description: [Insert detailed description of the scene or situation]
  Image URLs: [Insert a list of image URLs, separated by commas]
  
  Output:
  Matching Image URLs: [Provide a list of the image URLs that depict the objects or actions described in the text, separated by commas]
  
  Example:
  Description: A woman is sitting on a park bench, reading a book. A dog is playing fetch with a ball in the background. Image URLs: [https://image1.png, https://image2.png, https://image3.jpeg, https://image4.gif] Matching Image URLs: https://image1.jpg, https:/image3.jpeg

  Please note: I may not always provide enough image URLs to cover all elements mentioned in the description. Focus on finding the most relevant images.
""") 