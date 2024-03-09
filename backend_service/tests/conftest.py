import asyncio

import pytest
from httpx import AsyncClient
from httpx._transports.asgi import ASGITransport
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from main import app
from settings import settings
from src.common.dependencies import get_session
from src.database.models import BaseMixin


@pytest.fixture(scope='session')
def event_loop() -> asyncio.AbstractEventLoop:
    loop = asyncio.get_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope='session')
async def db_async_engine() -> AsyncEngine:
    async_engine = create_async_engine(settings.TEST_DB_URL)

    async with async_engine.begin() as conn:
        await conn.run_sync(BaseMixin.metadata.create_all)

    yield async_engine


@pytest.fixture(scope='function')
async def db_session(db_async_engine: AsyncEngine) -> AsyncSession:
    async with db_async_engine.connect() as connection:
        async with connection.begin() as transaction:
            async_session = sessionmaker(
                bind=connection,
                class_=AsyncSession,
                autoflush=False,
                expire_on_commit=False
            )()

            try:
                yield async_session
            finally:
                await async_session.close()
                await transaction.rollback()


@pytest.fixture(scope='function')
async def client(db_session: AsyncSession) -> AsyncClient:
    def override_get_db() -> AsyncSession:
        yield db_session

    app.dependency_overrides[get_session] = override_get_db

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
        follow_redirects=True
    ) as c:
        yield c

    del app.dependency_overrides[get_session]
