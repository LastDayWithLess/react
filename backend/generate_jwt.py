from config import settings
from jose import jwt, JWTError
from datetime import datetime, timedelta, timezone
from fastapi import HTTPException, status

def create_acces_tocken(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=30)
    to_encode.update({"exp": expire})
    auth_data = settings.get_auth_data
    encode_jwt = jwt.encode(to_encode, auth_data["secret_key"], algorithm=auth_data["algorithm"])

    return encode_jwt

def decode_access_token(token: str) -> dict:
    auth_data = settings.get_auth_data
    try:
        payload = jwt.decode(token, auth_data["secret_key"], algorithms=[auth_data["algorithm"]])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Недействительный токен",
            headers={"WWW-Authenticate": "Bearer"},
        )

def create_email_token(data: dict, expires_delta: int = 3600):
    auth_data = settings.get_auth_data
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(seconds=expires_delta)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, auth_data["secret_key"], algorithm=auth_data["algorithm"])

def decode_email_token(token: str):
    auth_data = settings.get_auth_data

    return jwt.decode(token, auth_data["secret_key"], algorithms=[auth_data["algorithm"]])