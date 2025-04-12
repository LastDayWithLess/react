from sqlalchemy.orm import Mapped, mapped_column
from database import Base, async_engine
from sqlalchemy import LargeBinary
from typing import Union
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy import Boolean

class UserModel(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    name_user: Mapped[Union[str, None]] = mapped_column(nullable=True)
    description: Mapped[Union[str, None]] = mapped_column(nullable=True)
    image_profile: Mapped[Union[str, None]] = mapped_column(LargeBinary, nullable=True)
    is_verified: Mapped[bool]= mapped_column(default=False)

    shopping_cart: Mapped[list["ShoppingCart"]] = relationship("ShoppingCart", back_populates="user")


class ShoppingCart(Base):
    __tablename__ = "shopping_cart"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    images: Mapped[str]
    price: Mapped[int]
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)

    user: Mapped[UserModel] = relationship("UserModel", back_populates="shopping_cart")


async def create_table():
    async with async_engine.begin() as conn:
        await conn.run_sync(lambda sync_conn: Base.metadata.create_all(bind=sync_conn))
