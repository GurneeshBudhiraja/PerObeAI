# for type hinting
from fastapi import FastAPI
# Middleware to compress the response
from fastapi.middleware.gzip import GZipMiddleware

# Function to configure the GZip middleware
def configure_gzip_middleware(app:FastAPI):
  """
  Add the GZip middleware to the FastAPI application

  Args:
    app (FastAPI): The FastAPI application instance
  """
  app.add_middleware(GZipMiddleware,minimum_size=1000)