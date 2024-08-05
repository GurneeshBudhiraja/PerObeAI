from utils import logger


def format_response(
    status_code: int = None,
    message: str = None,
    details: dict = None,
    url: str = None,
    path: str = None,
    method: str = None,
    **kwargs,
) -> dict:
    """
    Formats the response object

    Args:
        status_code (int): The status code
        message (str): The message
        details (dict): The details
        url (str): The URL
        path (str): The path
        method (str): The method

    Returns:
        dict: The response object
    """

    try:

        return {
            "status_code": status_code or "",
            "message": message or "",
            "details": details or {},
            "url": url or "",
            "path": path or "",
            "method": method or "",
            "additional_info": kwargs,
        }

    except Exception as e:
        logger.error(
            f"An error occurred while formatting the response object: {str(e)}"
        )
        raise Exception("Error occurred while formatting the response object")
