import asyncio
import time
from typing import Generator
from uuid import uuid4

import jwt
import pytest
from httpx import AsyncClient
from httpx._transports.asgi import ASGITransport
from passlib.context import CryptContext
from pytest_mock import MockerFixture
from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from main import app
from settings import settings
from src.common.dependencies import get_session
from src.database.models import BaseMixin
from src.folders.models import FolderModel
from src.users.models import UserModel
from tests.consts import OTHER_TEST_USER_DATA, TEST_USER_DATA


@pytest.fixture(scope="function")  # TODO: Make session scope
def event_loop() -> Generator:
    loop = asyncio.get_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope='function')  # TODO: Make session scope
async def db_async_engine() -> AsyncEngine:
    async_engine = create_async_engine(settings.TEST_DB_URL)

    async with async_engine.begin() as conn:
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
async def test_user(db_session: AsyncSession) -> UserModel:
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    user = UserModel(
        id=uuid4(),
        email=TEST_USER_DATA['email'],
        name=TEST_USER_DATA['name'],
        hashed_password=pwd_context.hash(TEST_USER_DATA['password'])
    )
    db_session.add(user)
    await db_session.commit()
    return user


@pytest.fixture(scope='function')
async def other_test_user(db_session: AsyncSession) -> UserModel:
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    other_user = UserModel(
        id=uuid4(),
        email=OTHER_TEST_USER_DATA['email'],
        name=OTHER_TEST_USER_DATA['name'],
        hashed_password=pwd_context.hash(OTHER_TEST_USER_DATA['password'])
    )
    db_session.add(other_user)
    await db_session.commit()
    return other_user


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
async def auth_client(client: AsyncClient, test_user: UserModel) -> AsyncClient:
    access_token = jwt.encode(
        {
            "user_id": str(test_user.id),
            "exp": time.time() + settings.ACCESS_TOKEN_LIFETIME,
            "type": "access"
        },
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM
    )

    client.headers = {
        "Authorization": f"Bearer {access_token.decode('utf-8')}",
        **client.headers
    }
    yield client


@pytest.fixture(scope='function')
async def redis_setex_mock(mocker: MockerFixture):
    redis_mock = mocker.patch("src.redis.redis_storage.setex", new=mocker.AsyncMock())
    yield redis_mock


@pytest.fixture(scope='function')
async def folder(db_session: AsyncSession, test_user: UserModel) -> FolderModel:
    folder = FolderModel(id=uuid4(), title="test_folder", user_id=test_user.id)
    db_session.add(folder)
    await db_session.commit()
    return folder
