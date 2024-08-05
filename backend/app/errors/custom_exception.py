from typing import Optional, Dict
from fastapi import HTTPException, status


class CustomException(Exception):
    def __init__(
        self, status_code: int, message: str, details: Optional[Dict] = None
    ) -> None:
        """
        Custom exception class to handle exceptions

        Args:
          status_code (int): The status code of the exception
          message (str): The message of the exception
          details (Optional[Dict], optional): The details of the exception. Defaults to None.

        Returns:
          None
        """

        super().__init__(message)

        self.message = message

        self.status_code = status_code

        self.details = details or {}
