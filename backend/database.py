from config import settings
from sqlalchemy.ext.asyncio import create_async_engine, AsyncAttrs, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase

async_engine = create_async_engine(
    url=settings.POSTGRES_get_url,
    pool_size=5,
    echo=True
)

class Base(DeclarativeBase, AsyncAttrs):
    pass

async_session = async_sessionmaker(async_engine)


async def get_db():
    async with async_session() as session:
        yield session