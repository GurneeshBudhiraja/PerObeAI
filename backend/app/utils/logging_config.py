import logging
import os
from logtail import LogtailHandler
from app.errors.custom_exception import CustomException
from fastapi import status


def get_logger():
    """
    Configures and returns a logger instance with LogtailHandler.

    The logger is configured to use the LogtailHandler with the source token
    specified in the environment variable 'LOGS_TOKEN'. The logger level is set
    based on the 'LOG_LEVEL' environment variable.

    Returns:
        logging.Logger: A configured logger instance.
    """
    try:

        logs_token = os.getenv("LOGS_TOKEN")

        handler = LogtailHandler(source_token=logs_token)

        logger = logging.getLogger(__name__)

        log_level = os.getenv("LOG_LEVEL", "INFO").upper()

        logger.setLevel(getattr(logging, log_level, logging.INFO))

        logger.handlers = []

        logger.addHandler(handler)

        return logger

    except Exception as e:

        raise CustomException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message=str(e),
            details={"description": "An error occurred while configuring the logger"},
        )


# Initialize the logger
logger = get_logger()
