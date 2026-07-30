from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker

from src.infrastructure.database.models import Base

engine = None
AsyncSessionLocal = None


async def init_db(database_url: str) -> None:
    global engine, AsyncSessionLocal
    engine = create_async_engine(database_url, echo=False)
    AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)


async def get_session():
    if AsyncSessionLocal is None:
        raise RuntimeError("Database not initialized")
    async with AsyncSessionLocal() as session:
        yield session


async def create_tables() -> None:
    if engine is None:
        raise RuntimeError("Database not initialized")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
