from httpx import AsyncClient
from pytest_mock import MockerFixture
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.news.models import NewsModel
from src.news.schemas import NewsSource


TEST_DATA = [
    {
        "title": "test title",
        "url": "https://test.ru/",
        "source": str(NewsSource.RBC.value),
        "description": "test description",
        "published_at": "2024-03-21T19:39:00"
    },
    {
        "title": "test title 2",
        "url": "https://test2.ru/",
        "source": str(NewsSource.TELEGRAM.value),
        "description": "test description 2",
        "published_at": "2022-01-02T00:00:00"
    }
]


async def test_valid_case(
    client: AsyncClient,
    db_session: AsyncSession,
    mocker: MockerFixture,
    redis_delete_mock
):
    news_create_token = "news_create_token"
    redis_get_mock = mocker.patch(
        "src.redis.redis_storage.get",
        new=mocker.AsyncMock(return_value=news_create_token)
    )

    response = await client.post(
        "/api/v1/news/list",
        json=TEST_DATA,
        headers={"Authorization": f"Bearer {news_create_token}"}
    )
    assert response.status_code == 201

    assert redis_get_mock.call_count == 1

    created_news = await db_session.execute(select(NewsModel))
    created_news = list(created_news.scalars().all())

    assert len(created_news) == 2

    assert created_news[0].title == TEST_DATA[0]["title"]
    assert created_news[0].url == TEST_DATA[0]["url"]
    assert created_news[0].source == NewsSource.RBC.value
    assert created_news[0].description == TEST_DATA[0]["description"]
    assert created_news[0].published_at.isoformat() == TEST_DATA[0]["published_at"]

    assert created_news[1].title == TEST_DATA[1]["title"]
    assert created_news[1].url == TEST_DATA[1]["url"]
    assert created_news[1].source == NewsSource.TELEGRAM.value
    assert created_news[1].description == TEST_DATA[1]["description"]
    assert created_news[1].published_at.isoformat() == TEST_DATA[1]["published_at"]

    redis_delete_mock.assert_called_once()


async def test_not_token(client: AsyncClient):
    response = await client.post("/api/v1/news/list", json=TEST_DATA)

    assert response.status_code == 403
    assert response.json() == {"detail": "Not authenticated"}


async def test_not_valid_token(client: AsyncClient, mocker: MockerFixture):
    redis_get_mock = mocker.patch(
        "src.redis.redis_storage.get",
        new=mocker.AsyncMock(return_value=None)
    )

    response = await client.post(
        "/api/v1/news/list",
        json=TEST_DATA,
        headers={"Authorization": "Bearer not_valid_token"}
    )

    assert response.status_code == 401
    assert response.json() == {"detail": "Incorrect header token schema"}

    assert redis_get_mock.call_count == 1
