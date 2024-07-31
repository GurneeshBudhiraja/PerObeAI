import uvicorn
from fastapi import FastAPI, Depends
from dotenv import load_dotenv
import os
from starlette.middleware.base import BaseHTTPMiddleware

# Import routers and middlewares
from routers import images_router,recommendation_router
from middlewares import configure_cors_middleware, configure_logger_middleware, configure_trusted_host_middleware, configure_gzip_middleware


from firebase_utils import verify_firebase_uid

# Load the environment variables
load_dotenv()



# Initialize the FastAPI application
app = FastAPI(
  title="PerObeAI",
  description="This is the backend for the PerObeAI project",
  version="0.1"
  )



"""
Middlewares Configuration
"""
# FastAPI GZip middleware to compress the response
configure_gzip_middleware(app)

# FastAPI CORS middleware to handle cross-origin requests
configure_cors_middleware(app)

# FastAPI trusted host middleware to allow requests from the allowed hosts
configure_trusted_host_middleware(app)

# Custom logger middleware to log the requests details
app.add_middleware(BaseHTTPMiddleware, dispatch=configure_logger_middleware)

"""
Routers
"""

@app.get("/")
def home():
  return {"message":"Welcome to the PerObeAI backend"}
# Include the routers TODO: will add separate comments for each router
app.include_router(images_router.router)
app.include_router(recommendation_router.router)

@app.get("/secure-endpoint")
async def secure_endpoint(uid:str = Depends(verify_firebase_uid)):
  return {"message": f"Hello, user {uid}"}

# Entry point of the application
if __name__=="__main__":
  # Get the PORT from the env variable, default to 8000 if PORT not found
  port = int(os.getenv("PORT",8000))
  uvicorn.run("app:app",port=port, reload=True)




