from datetime import datetime, timedelta

from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from src.news.domain import NewsSource
from src.news.models import NewsModel


async def test_one_item(client: AsyncClient, db_session: AsyncSession):
    news = NewsModel(
        title="title",
        url="http://example.com",
        source=NewsSource.RBC.value,
        description="description",
        published_at=datetime.now()
    )
    db_session.add(news)
    await db_session.commit()

    response = await client.get("/api/v1/news/")
    assert response.status_code == 200

    response_data = response.json()
    assert response_data['total'] == 1

    item = response_data['items'][0]

    assert item['title'] == "title"
    assert item['url'] == "http://example.com/"
    assert item['description'] == "description"
    assert item['published_at'] == news.published_at.isoformat()


async def test_pagination(client: AsyncClient, db_session: AsyncSession):
    for i in range(15):
        news = NewsModel(
            title=f"title {i}",
            url=f"http://example.com/{i}",
            source=NewsSource.RBC.value,
            description=f"description {i}",
            published_at=datetime.now() - timedelta(minutes=i)
        )
        db_session.add(news)
    await db_session.commit()

    response = await client.get("/api/v1/news/?size=10")
    assert response.status_code == 200

    response_data = response.json()
    assert response_data['total'] == 15
    assert len(response_data['items']) == 10

    response = await client.get("/api/v1/news/?size=10&page=2")
    assert response.status_code == 200

    response_data = response.json()
    assert response_data['total'] == 15
    assert len(response_data['items']) == 5
    assert response_data['items'][0]['title'] == "title 10"
    assert response_data['items'][4]['title'] == "title 14"
