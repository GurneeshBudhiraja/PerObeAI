from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage
import base64, requests
import os
from dotenv import load_dotenv
load_dotenv()

image = base64.b64encode(requests.get("https://firebasestorage.googleapis.com/v0/b/perobeai-430021.appspot.com/o/JKVDl1ErPjaj3TPRNuBUsN3W9xS2%2F1pants4f3912a4-14bf-4f46-a255-89677ac76b37.png?alt=media&token=7b8f89ff-7bd8-46d5-8b6a-eaa6c4292372").content).decode("utf-8")

message = HumanMessage(
content=[
  {
    "type": "text",
    "text": "What's in this image? provide full detail as possible.",
  }, # You can optionally provide text parts
  {"type": "image_url", "image_url": f"data:image/jpeg;base64,{image}"},
])
llm = ChatGoogleGenerativeAI(model="gemini-pro-vision")

print(
llm.invoke([message]).content
)
