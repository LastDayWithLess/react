from fastapi import FastAPI, Depends, HTTPException, status
from typing import Annotated
from pydantic import BaseModel
from fastapi.security import  OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, insert, update
from contextlib import asynccontextmanager
from python_schma import UsersOAu, UsersProdile, ShoppingCartItem
from models import UserModel, ShoppingCart
from database import get_db
from models import create_table
from hash_pasword import get_password, verify_password_hash
from generate_jwt import create_acces_tocken, decode_access_token, create_email_token, decode_email_token
from fastapi.middleware.cors import CORSMiddleware
import smtplib
from email.mime.text import MIMEText
from dotenv import load_dotenv
import os

load_dotenv()

def send_verification_email(to_email: str, token: str):
    verify_url = f"http://localhost:8000/verify-email?token={token}"
    body = f"Перейдите по ссылке, чтобы подтвердить почту: {verify_url}"

    msg = MIMEText(body)
    msg["Subject"] = "Подтверждение почты"
    msg["From"] = os.getenv("EMAIL")
    msg["To"] = to_email

    with smtplib.SMTP("smtp.gmail.com", 587) as smtp:
        smtp.starttls()
        smtp.login(os.getenv("EMAIL"), "nzgs mgnf ufab ognr")  # см. примечание ниже
        smtp.send_message(msg)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_table() 
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)   


@app.post("/register")
async def register_user(user_data: UsersOAu, db: Annotated[AsyncSession, Depends(get_db)]):
    user = await db.execute(select(UserModel).where(UserModel.email == user_data.email))
    existing_user = user.scalar_one_or_none()

    if existing_user:
        raise HTTPException(status_code=400, detail="Пользователь уже существует")

    hashed_password = get_password(user_data.password)
    stmt = insert(UserModel).values(email=user_data.email, password=hashed_password)
    await db.execute(stmt)
    await db.commit()

    token = create_email_token({"sub": user_data.email})
    send_verification_email(user_data.email, token)

    return {"message": "Подтвердите почту. Ссылка отправлена на email"}


from fastapi.responses import RedirectResponse

@app.get("/verify-email")
async def verify_email(token: str, db: AsyncSession = Depends(get_db)):
    try:
        payload = decode_email_token(token)
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=400, detail="Недействительный токен")

        stmt = update(UserModel).where(UserModel.email == email).values(is_verified=True)
        await db.execute(stmt)
        await db.commit()
        
        
        return RedirectResponse(url="http://localhost:3000/")

    except Exception:
        raise HTTPException(status_code=400, detail="Невозможно подтвердить почту")



from fastapi.security import OAuth2PasswordRequestForm

@app.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(UserModel).where(UserModel.email == form_data.username))
    user = result.scalar_one_or_none()

    if not user or not verify_password_hash(form_data.password, user.password):
        raise HTTPException(status_code=401, detail="Неверные email или пароль")

    token = create_acces_tocken({"sub": user.email, "user_id": user.id})
    return {"access_token": token, "token_type": "bearer"}

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
) -> UserModel:
    payload = decode_access_token(token)
    email = payload.get("sub")
    if not email:
        raise HTTPException(status_code=401, detail="Недействительный токен")

    user_query = await db.execute(select(UserModel).where(UserModel.email == email))
    user = user_query.scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    return user

@app.post("/profile")
async def update_profile(
    prof: UsersProdile,
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_user)
):
    image_data = prof.image_profile.encode() if prof.image_profile else None

    stmt = (
        update(UserModel)
        .where(UserModel.id == current_user.id)
        .values(
            name_user=prof.name_user,
            description=prof.description,
            image_profile=image_data 
        )
    )
    await db.execute(stmt)
    await db.commit()

    return {"message": "Профиль обновлён"}

@app.get("/get_profile")
async def get_profile(current_user: UserModel = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
   
    query = select(UserModel).where(UserModel.id == current_user.id)
    result = await db.execute(query)
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")


    image_profile_base64 = user.image_profile.decode() if user.image_profile else None

    return {
        "name_user": user.name_user,
        "description": user.description,
        "image_profile": image_profile_base64,
    }


@app.post("/add-to-cart/")
async def add_to_cart(
    item: ShoppingCartItem,
    db: Annotated[AsyncSession, Depends(get_db)],
    current_user: UserModel = Depends(get_current_user)
):
    user_id = current_user.id

    stmt = insert(ShoppingCart).values(
        name=item.name,
        images=item.images,
        price=item.price,
        user_id=current_user.id
    )
    await db.execute(stmt)
    await db.commit()
    return {"message": "Товар добавлен в корзину"}

@app.get("/get_cart")
async def get_cart(
    current_user: UserModel = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(ShoppingCart).where(ShoppingCart.user_id == current_user.id)
    result = await db.execute(stmt)
    cart = result.scalars().all()

    return [
        {
            "id": item.id,
            "name": item.name,
            "price": item.price,
            "images": item.images
        }
        for item in cart
    ]

@app.delete("/remove_from_cart/{item_id}")
async def remove_from_cart(
    item_id: int,
    current_user: UserModel = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(ShoppingCart).where(
        ShoppingCart.id == item_id, 
        ShoppingCart.user_id == current_user.id
    )
    result = await db.execute(stmt)
    item = result.scalars().first()

    if not item:
        raise HTTPException(status_code=404, detail="Товар не найден в корзине")

    await db.delete(item)
    await db.commit()

    return {"message": "Товар удален из корзины"}