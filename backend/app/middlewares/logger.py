"""
The logger middleware is used to log the requests and responses of the FastAPI application.
"""
from fastapi import Request
import time
# Logger object for logging
from utils import logger



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

