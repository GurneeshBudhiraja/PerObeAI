from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os
import firebase_admin
from firebase_admin import auth, credentials


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
        uid = auth.verify_id_token(firebase_id_token)
        return uid

    except ValueError:
        # TODO: will handle the error later on with proper logging and custom class
        # For invalid tokens
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden: Invalid ID token"
        )

    except firebase_admin.auth.ExpiredIdTokenError:
        # For expired tokens
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden: Expired ID token"
        )

    except firebase_admin.auth.RevokedIdTokenError:
        # For revoked tokens
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden: Revoked ID token"
        )

    except Exception as e:
        # Other exceptions
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Forbidden: Authentication failed: {str(e)}",
        )
