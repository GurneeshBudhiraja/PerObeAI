from typing import Callable
from fastapi import Request, Response
import json
from errors.custom_exception import CustomException
from utils import format_response, logger
import time


async def configure_response_format_middleware(
    request: Request, call_next: Callable
) -> Response:
    """
    Add the configure_response_format_middleware to the FastAPI application for formatting the response in a specific format

    Args:
      request (Request): The Request instance
      call_next (Callable): The next middleware in the chain

    Returns:
      Response: The response in a specific format
    """

    try:

        start_time = time.time()

        response = await call_next(request)

        if response.media_type != "application/json":
            return response

        response_body = b""

        async for chunk in response.body_iterator:
            response_body += chunk

        json_response = json.loads(response_body.decode("utf-8"))

        if "error" in json_response:
            return Response(
                content=response_body,
                status_code=response.status_code,
                headers=dict(response.headers),
                media_type=response.media_type,
            )

        formatted_response = format_response(
            status_code=response.status_code,
            message="success",
            details=json_response,
            url=str(request.url),
            path=str(request.url.path),
            method=request.method,
        )

        modified_response = json.dumps(formatted_response).encode("utf-8")

        response.headers["Content-Length"] = str(len(modified_response))

        end_time = time.time()

        processing_time = end_time - start_time

        logger.info(
            f"{request.method} {request.url} - Status: {response.status_code} - User Agent: {request.headers.get('User-Agent', '-')} - Processing Time: {processing_time:.2f} seconds"
        )

        return Response(
            content=json.dumps(formatted_response).encode("utf-8"),
            headers=dict(response.headers),
            media_type=response.media_type,
        )

    except Exception as e:
        logger.error(f"{request.method} {request.url} - Error: {str(e)}")
        raise CustomException(
            status_code=500,
            message=str(e),
            details={"description": "Internal Server Error"},
        )
