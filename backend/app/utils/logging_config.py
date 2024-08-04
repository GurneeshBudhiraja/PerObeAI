import logging
import os
from logtail import LogtailHandler


def get_logger():
    """
    Configures and returns a logger instance with LogtailHandler.

    The logger is configured to use the LogtailHandler with the source token
    specified in the environment variable 'LOGS_TOKEN'. The logger level is set
    based on the 'LOG_LEVEL' environment variable.

    Returns:
        logging.Logger: A configured logger instance.
    """
    logs_token = os.getenv("LOGS_TOKEN")
    if not logs_token:
        # TODO: Will handle this case later
        return

    handler = LogtailHandler(source_token=logs_token)
    logger = logging.getLogger(__name__)

    # Set log level from environment variable, default to INFO
    log_level = os.getenv("LOG_LEVEL", "INFO").upper()
    logger.setLevel(getattr(logging, log_level, logging.INFO))

    logger.handlers = []
    logger.addHandler(handler)
    return logger


# Initialize the logger
logger = get_logger()
