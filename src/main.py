import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from controllers import gemini_router

app = FastAPI()

origins = [
  "*"
]

app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

@app.get("/")
def read_root():
  return {"Hello": "World"}

app.include_router(gemini_router.router)


if __name__=="__main__":
  uvicorn.run("main:app", host="127.0.0.1", port=3000, reload=True)




