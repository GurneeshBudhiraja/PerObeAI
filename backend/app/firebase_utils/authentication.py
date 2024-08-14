from fastapi import Depends, Request, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os
import firebase_admin
from firebase_admin import auth, credentials
from app.errors.custom_exception import CustomException

cred = credentials.Certificate(os.getenv("FIREBASE_SERVICE_ACCOUNT_KEY"))
firebase_admin.initialize_app(cred)


def verify_firebase_uid(
    request: Request, credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer())
):
    """
    Verifies the Firebase ID token sent in the Authorization header of the request.

    Args:
        request (Request): The request object
        credentials (HTTPAuthorizationCredentials, optional): The credentials object. Defaults to Depends(HTTPBearer()).

    Returns:
        str: The Firebase UID
    """
    firebase_id_token = credentials.credentials
    try:
        # Verify the ID token and retrieve the uid
        user_info = auth.verify_id_token(firebase_id_token)
        return user_info["user_id"]

    except ValueError as e:
        # For invalid tokens
        raise CustomException(
            status_code=status.HTTP_403_FORBIDDEN,
            message=str(e),
            details={"description": "Forbidden: Invalid ID token"},
        )

    except firebase_admin.auth.ExpiredIdTokenError as e:
        # For expired tokens
        raise CustomException(
            status_code=status.HTTP_403_FORBIDDEN,
            message=str(e),
            details={"description": "Forbidden: Expired ID token"},
        )

    except firebase_admin.auth.RevokedIdTokenError as e:
        # For revoked tokens
        raise CustomException(
            status_code=status.HTTP_403_FORBIDDEN,
            message=str(e),
            details={"description": "Forbidden: Revoked ID token"},
        )

    except Exception as e:
        # Other exceptions
        raise CustomException(
            status_code=status.HTTP_403_FORBIDDEN,
            message=str(e),
            details={
                "description": "An error occurred while verifying the Firebase ID token"
            },
        )
