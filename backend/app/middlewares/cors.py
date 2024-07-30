# Middleware to handle CORS
from fastapi.middleware.cors import CORSMiddleware

# list of allowed origins
from constants import origins_allowed 


def configure_cors_middleware(app):
  """
  Add the CORS middleware to the FastAPI application

  Args:
    app (FastAPI): The FastAPI application instance
  """

  app.add_middleware(
    CORSMiddleware,
    allow_origins=origins_allowed,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
