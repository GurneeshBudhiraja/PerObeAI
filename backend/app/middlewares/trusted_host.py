

# For type hinting
from fastapi import FastAPI
# Middleware to check Host header
from fastapi.middleware.trustedhost import TrustedHostMiddleware
# Import the allowed hosts from the constants
from constants import ALLOWED_HOSTS

def configure_trusted_host_middleware(app: FastAPI):
  """
  Add the TrustedHostMiddleware to the FastAPI application to check the Host header of the incoming request and only allow the requests from the specified hosts.

  Args:
    app (FastAPI): The FastAPI application instance
  """
  app.add_middleware(TrustedHostMiddleware, allowed_hosts=ALLOWED_HOSTS)