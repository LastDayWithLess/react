from passlib.context import CryptContext

pwd_context = CryptContext(schemes=['bcrypt'], deprecated="auto")

def get_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password_hash(plain_password: str, hashed_password: str) -> str:
    return pwd_context.verify(plain_password, hashed_password)