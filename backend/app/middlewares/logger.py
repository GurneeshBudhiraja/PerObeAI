from fastapi import Request
from logtail import LogtailHandler
import logging
import time
import os


# Function to configure the logger
def get_logger():
  print(f"Logger boilerplate :: {os.getenv('LOGS_TOKEN')}") # Debugging
  handler = LogtailHandler(source_token=os.getenv("LOGS_TOKEN"))
  logger = logging.getLogger(__name__)
  logger.setLevel(logging.INFO)
  logger.handlers = []
  logger.addHandler(handler)
  return logger

# Initialize the logger
logger  = get_logger()

# Middleware to log requests
async def configure_logger_middleware(request:Request,call_next):
  # Request receive time
  receive_time = time.time()

  try:
    # Call the next middleware or route handler
    response = await call_next(request)
  except Exception as e:
    # Request end time
    end_time = time.time()

    # Total time taken by the request
    process_time = end_time - receive_time
    
    # Logging the error
    logger.error({
        "path": request.url.path,
        "method": request.method,
        "process_time": process_time,
        "error": str(e)
    })
    raise e
  else:
    # Request end time
    end_time = time.time()

    # Total time taken by the request
    process_time = end_time-receive_time
    
    # Log info dictionary
    logger.info({
      "path":request.url.path,
      "method":request.method,
      "process_time":process_time,
    })
    return response

