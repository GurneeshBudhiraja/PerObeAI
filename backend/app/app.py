import uvicorn
from fastapi import FastAPI
from dotenv import load_dotenv
import os
from starlette.middleware.base import BaseHTTPMiddleware

# Load the environment variables
load_dotenv()

# Import routers and middlewares
from routers.web_apis.v1 import (
    embedding_router,
    recommendation_router,
    vector_store_router,
)

from middlewares import (
    configure_cors_middleware,
    configure_logger_middleware,
    configure_trusted_host_middleware,
    configure_gzip_middleware,
)


# Initialize the FastAPI application
app = FastAPI(
    title="PerObeAI - Personal Wardrobe AI",
    description="This is the backend for the PerObeAI project",
    version="1.0.0",
)


"""
Middlewares Configuration
"""
configure_gzip_middleware(app)

configure_cors_middleware(app)

configure_trusted_host_middleware(app)

app.add_middleware(BaseHTTPMiddleware, dispatch=configure_logger_middleware)


"""
Routers
"""
app.include_router(embedding_router)
app.include_router(recommendation_router)
app.include_router(vector_store_router)


# Entry point of the application
if __name__ == "__main__":
    # Get the PORT from the env variable, default to 8000 if PORT not found
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("app:app", port=port, reload=True)
