import uvicorn
from fastapi import FastAPI
from dotenv import load_dotenv
import os
from starlette.middleware.base import BaseHTTPMiddleware

# Import routers and middleware configuration
from routers import images_router,recommendation_router
from middlewares import configure_cors_middleware, configure_logger_middleware


# Load the environment variables
load_dotenv()

# Create the FastAPI instance
app = FastAPI(title="PerObeAI",description="This is the backend for the PerObeAI project",version="0.1")



"""
Middlewares
"""
# Add the CORS middleware
configure_cors_middleware(app)

# Add the logger middleware
app.add_middleware(BaseHTTPMiddleware,dispatch=configure_logger_middleware)

"""
Routers
"""

# Include the routers TODO: will add separate comments for each router
app.include_router(images_router.router)
app.include_router(recommendation_router.router)



# Main entry point
if __name__=="__main__":
  # Get the port from the env variable, default to 8000
  port = int(os.getenv("PORT",8000))
  uvicorn.run("app:app",port=port, reload=True)




