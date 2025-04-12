from pydantic import BaseModel
from typing import Union

class UsersOAu(BaseModel):
    email: str
    password: str

class UsersProdile(BaseModel):
    name_user: str
    description: str
    image_profile: str

class ShoppingCartItem(BaseModel):
    name: str
    images: str
    price: int