import asyncio
from datetime import datetime
from typing import Generator
from uuid import uuid4

import pytest
from httpx import AsyncClient
from httpx._transports.asgi import ASGITransport
from pytest_mock import MockerFixture
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from main import app
from settings import settings
from src.common.dependencies import get_session
from src.database.models import BaseMixin
from src.news.domain import NewsSource
from src.news.models import NewsModel


@pytest.fixture(scope="function")  # TODO: Make session scope
def event_loop() -> Generator:
    loop = asyncio.get_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope='function')  # TODO: Make session scope
async def db_async_engine() -> AsyncEngine:
    async_engine = create_async_engine(settings.TEST_DB_URL)

    async with async_engine.begin() as conn:
        await conn.run_sync(lambda conn: conn.execute(text('DROP TABLE IF EXISTS news CASCADE')))

        # Удаление всех таблиц
        await conn.run_sync(BaseMixin.metadata.drop_all)
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


@pytest.fixture(scope='function')
async def redis_setex_mock(mocker: MockerFixture):
    redis_mock = mocker.patch("src.redis.redis_storage.setex", new=mocker.AsyncMock())
    yield redis_mock


@pytest.fixture(scope='function')
async def redis_delete_mock(mocker: MockerFixture):
    redis_mock = mocker.patch("src.redis.redis_storage.delete", new=mocker.AsyncMock())
    yield redis_mock


@pytest.fixture(scope='function')
async def news(db_session: AsyncSession) -> NewsModel:
    news = NewsModel(
        id=uuid4(),
        title="test_news",
        url="https://test.com/",
        source=NewsSource.RBC.value,
        description="test_description",
        published_at=datetime.now()
    )
    db_session.add(news)
    await db_session.commit()
    return news
