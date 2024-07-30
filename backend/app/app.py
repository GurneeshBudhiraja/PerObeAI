import uvicorn
# Import the FastAPI class
from fastapi import FastAPI
# For loading the environment variables
from dotenv import load_dotenv
# For using the environment variables
import os
# Base class for creating custom middleware in FastAPI
from starlette.middleware.base import BaseHTTPMiddleware
# Import the routers
from routers import images_router,recommendation_router
# Import the middleware functions
from middlewares import configure_cors_middleware, configure_logger_middleware


# Load the environment variables
load_dotenv()

# FastAPI instance
app = FastAPI(title="PerObeAI",description="This is the backend for the PerObeAI project",version="0.1")



"""
Middlewares
"""
# CORS middleware
configure_cors_middleware(app)

# Logger middleware
app.add_middleware(BaseHTTPMiddleware,dispatch=configure_logger_middleware)

"""
Routers
"""

# Include the routers TODO: will add separate comments for each router
app.include_router(images_router.router)
app.include_router(recommendation_router.router)



# Entry point of the application
if __name__=="__main__":
  # Get the PORT from the env variable, default to 8000 if PORT not found
  port = int(os.getenv("PORT",8000))
  uvicorn.run("app:app",port=port, reload=True)




