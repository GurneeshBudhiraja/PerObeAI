from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from constants import ALLOWED_ORIGINS


def configure_cors_middleware(app: FastAPI):
    """
    Add the CORS middleware to the FastAPI application

    Args:
      app (FastAPI): The FastAPI application instance
    """

    app.add_middleware(
        CORSMiddleware,
        allow_origins=ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
