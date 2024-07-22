from langchain_google_genai import GoogleGenerativeAIEmbeddings

from dotenv import load_dotenv
import os
load_dotenv()
embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001",google_api_key=os.getenv("GOOGLE_API_KEY"))

vector = embeddings.embed_query("not pants")

print(vector[:5])

import pyperclip 
pyperclip.copy(vector)