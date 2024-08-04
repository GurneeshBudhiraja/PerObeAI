from fastapi import FastAPI
from fastapi.middleware.gzip import GZipMiddleware


def configure_gzip_middleware(app: FastAPI):
    """
    Add the GZip middleware to the FastAPI application to compress the response of the FastAPI application.

    Args:
      app (FastAPI): The FastAPI application instance
    """
    app.add_middleware(GZipMiddleware, minimum_size=1000)
