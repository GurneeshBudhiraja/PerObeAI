from fastapi.responses import JSONResponse
from fastapi import Request
from utils import logger
from .custom_exception import CustomException
from utils import format_response


def not_found_exception_handler(request: Request, exc) -> JSONResponse:
    """
    Custom response for not found errors

    Args:
      request (Request): The request object
      exc (Exception): The exception object

    Returns:
      JSONResponse: The JSON response object
    """

    try:
        logger.error(
            f"Exception occurred: {exc}. Method: {request.method}. URL: {request.url}"
        )

        error_response = format_response(
            status_code=404,
            message="Not Found",
            details={"error": "The requested resource was not found"},
            method=request.method,
            url=str(request.url),
            path=str(request.url.path),
        )

        return JSONResponse(status_code=404, content={"error": error_response})

    except Exception as e:

        raise CustomException(
            status_code=500,
            message=str(e),
            details={
                "description": f"An error occurred while handling the not found error",
            },
        )


def internal_server_error_handler(request: Request, exc) -> JSONResponse:
    """
    Custom response for internal server errors

    Args:
      request (Request): The request object
      exc (Exception): The exception object

    Returns:
      JSONResponse: The JSON response object
    """

    try:
        logger.error(
            f"Exception occurred: {exc}. Method: {request.method}. URL: {request.url}"
        )

        error_response = format_response(
            status_code=500,
            message="Internal Server Error",
            details={"error": "An error occurred while processing the request"},
            method=request.method,
            url=str(request.url),
            path=str(request.url.path),
        )

        return JSONResponse(status_code=500, content={"error": error_response})

    except Exception as e:

        raise CustomException(
            status_code=500,
            message=str(e),
            details={
                "description": f"An error occurred while handling the internal server error",
            },
        )


def validation_exception_handler(request: Request, exc) -> JSONResponse:
    """
    Custom response for validation errors

    Args:
      request (Request): The request object
      exc (Exception): The exception object

    Returns:
      JSONResponse: The JSON response object
    """

    try:
        logger.warning(
            f"Exception occurred: {exc}. Method: {request.method}. URL: {request.url}"
        )

        error_response = format_response(
            status_code=422,
            message="Unprocessable Entity",
            details={"error": f"The request is invalid", "error_details": str(exc)},
            method=request.method,
            url=str(request.url),
            path=str(request.url.path),
        )

        return JSONResponse(status_code=400, content={"error": error_response})

    except Exception as e:

        raise CustomException(
            status_code=500,
            message=str(e),
            details={
                "description": "An error occurred while handling the validation error",
            },
        )


def method_not_allowed_handler(request: Request, exc) -> JSONResponse:
    """
    Custom response for method not allowed errors

    Args:
      request (Request): The request object
      exc (Exception): The exception object

    Returns:
      JSONResponse: The JSON response object
    """

    try:
        logger.warning(
            f"Exception occurred: {exc}. Method: {request.method}. URL: {request.url}"
        )

        error_response = format_response(
            status_code=405,
            message="Method Not Allowed",
            details={"error": "The requested method is not allowed"},
            method=request.method,
            url=str(request.url),
            path=str(request.url.path),
        )

        return JSONResponse(status_code=405, content={"error": error_response})

    except Exception as e:

        raise CustomException(
            status_code=500,
            message=str(e),
            details={
                "description": "An error occurred while handling the method not allowed error",
            },
        )


def custom_exception_handler(request: Request, exc) -> JSONResponse:
    """
    Custom response for custom exceptions

    Args:
      request (Request): The request object
      exc (Exception): The exception object

    Returns:
      JSONResponse: The JSON response object
    """

    try:
        logger.error(
            f"Exception occurred: {exc}. Method: {request.method}. URL: {request.url}"
        )

        error_response = format_response(
            status_code=exc.status_code,
            message=exc.message,
            details={"error": exc.details},
            method=request.method,
            url=str(request.url),
            path=str(request.url.path),
            custom_exception="True",
        )

        return JSONResponse(
            status_code=exc.status_code, content={"error": error_response}
        )

    except Exception as e:

        logger.error(
            {
                "error": str(e),
                "details": {"error": str(exc)},
                "url": str(request.url),
                "path": str(request.url.path),
                "method": request.method,
            }
        )

        return JSONResponse(
            status_code=500,
            content={"error": "An error occurred while processing the request"},
        )
