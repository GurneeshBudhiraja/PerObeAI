from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os

# Firebase admin 
import firebase_admin
from firebase_admin import auth, credentials
import firebase_admin.auth


# Initialize Firebase Admin with service account credentials 
cred = credentials.Certificate(os.getenv("FIREBASE_SERVICE_ACCOUNT_KEY"))
firebase_admin.initialize_app(cred)

def verify_firebase_uid(request: Request, credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer())):
    # Get the id_token
    id_token = credentials.credentials
    try:
        # Verify the id_token and retrieve the uid
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except ValueError:
        # For invalid tokens
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden: Invalid ID token")
    except firebase_admin.auth.ExpiredIdTokenError:
        # For expired tokens
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden: Expired ID token")
    except firebase_admin.auth.RevokedIdTokenError:
        # For revoked tokens
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden: Revoked ID token")
    except Exception as e:
        # Other exceptions
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"Forbidden: Authentication failed: {str(e)}")
