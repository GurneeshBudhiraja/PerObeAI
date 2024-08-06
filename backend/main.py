from fastapi import FastAPI
from starlette.middleware.base import BaseHTTPMiddleware
from dotenv import load_dotenv
from fastapi.exceptions import RequestValidationError

# Custom error package
from app.errors.custom_exception import CustomException

from app.errors.error_handlers import (
    not_found_exception_handler,
    internal_server_error_handler,
    method_not_allowed_handler,
    validation_exception_handler,
    custom_exception_handler,
)

# Load the environment variables
load_dotenv()

# Import routers and middlewares
from app.routers.web_apis.v1 import (
    embedding_router,
    recommendation_router,
    vector_store_router,
)

from app.middlewares import (
    configure_cors_middleware,
    configure_trusted_host_middleware,
    configure_gzip_middleware,
    configure_response_format_middleware,
)

"""
Exception handlers
"""
EXCEPTION_HANDLERS = {
    404: not_found_exception_handler,
    500: internal_server_error_handler,
    405: method_not_allowed_handler,
    RequestValidationError: validation_exception_handler,
    CustomException: custom_exception_handler,
}


app = FastAPI(
    title="PerObeAI - Personal Wardrobe AI",
    description="This is the backend for the PerObeAI project",
    version="1.0.0",
    exception_handlers=EXCEPTION_HANDLERS,
)


"""
Middlewares Configuration
"""
configure_gzip_middleware(app)

configure_cors_middleware(app)

configure_trusted_host_middleware(app)

app.add_middleware(BaseHTTPMiddleware, dispatch=configure_response_format_middleware)

"""
Routers
"""
app.include_router(embedding_router)
app.include_router(recommendation_router)
app.include_router(vector_store_router)


@app.get("/testing")
def testing():
    return


if __name__ == "__main__":
    pass
