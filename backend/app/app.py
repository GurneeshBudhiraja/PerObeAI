import uvicorn
from fastapi import FastAPI
from dotenv import load_dotenv
import os
from starlette.middleware.base import BaseHTTPMiddleware

# Load the environment variables
load_dotenv()

# Import routers and middlewares
from routers.web_apis.v1 import embeddings_router, recommendation_router
from middlewares import configure_cors_middleware, configure_logger_middleware, configure_trusted_host_middleware, configure_gzip_middleware



# Initialize the FastAPI application
app = FastAPI(
  title="PerObeAI - Personal Wardrobe AI",
  description="This is the backend for the PerObeAI project",
  version="1.0.0"
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


# Include the routers TODO: will add separate comments for each router
app.include_router(embeddings_router)
app.include_router(recommendation_router)

# Entry point of the application
if __name__=="__main__":
  # Get the PORT from the env variable, default to 8000 if PORT not found
  port = int(os.getenv("PORT",8000))
  uvicorn.run("app:app",port=port, reload=True)




