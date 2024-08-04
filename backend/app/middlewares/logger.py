from fastapi import Request
from typing import Callable
import time
from utils import logger

async def configure_logger_middleware(request:Request,call_next:Callable):
  """
  Add the configure_logger_middleware to the FastAPI application for logging the request and time taken to process the request

  Args:
    request (Request): The Request instance
    call_next (Callable): The next middleware in the chain

  """  
  receive_time = time.time()
  
  try:
    response = await call_next(request)
  
  except Exception as e:
    end_time = time.time()
    process_time = end_time - receive_time
    
    logger.error({
        "path": request.url.path,
        "method": request.method,
        "process_time": process_time,
        "error": str(e)
    })
  else:
    end_time = time.time()
    process_time = end_time-receive_time
    
    logger.info({
      "path":request.url.path,
      "method":request.method,
      "process_time":process_time,
    })

    return response

