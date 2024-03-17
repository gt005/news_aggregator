from datetime import datetime, timedelta
from uuid import uuid4

from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from src.folders.models import FolderModel, FolderNewsModels
from src.news.domain import NewsSource
from src.news.models import NewsModel
from src.users.models import UserModel


async def test_one_item(
    auth_client: AsyncClient,
    db_session: AsyncSession,
    news_in_folder: NewsModel,
    folder: FolderModel
):
    response = await auth_client.get(f"/api/v1/news/{folder.id}/news")
    assert response.status_code == 200

    assert len(response.json()['items']) == 1
    news_item = response.json()['items'][0]

    assert news_item['id'] == str(news_in_folder.id)
    assert news_item['title'] == news_in_folder.title
    assert news_item['url'] == news_in_folder.url
    assert news_item['source'] == news_in_folder.source
    assert news_item['description'] == news_in_folder.description
    assert news_item['published_at'] == news_in_folder.published_at.isoformat()

    assert response.json()['page'] == 1
    assert response.json()['total'] == 1


async def test_paginate(auth_client: AsyncClient, db_session: AsyncSession, folder: FolderModel):
    for i in range(15):
        news = NewsModel(
            id=uuid4(),
            title=f"title {i}",
            url=f"http://example.com/{i}",
            source=NewsSource.RBC.value,
            description=f"description {i}",
            published_at=datetime.now() - timedelta(minutes=i)
        )
        folder_news = FolderNewsModels(
            id=uuid4(),
            news_id=news.id,
            folder_id=folder.id
        )
        db_session.add(news)
        db_session.add(folder_news)

    await db_session.commit()

    response = await auth_client.get(f"/api/v1/news/{folder.id}/news?size=10")
    assert response.status_code == 200

    response_data = response.json()

    assert response_data['total'] == 15
    assert len(response_data['items']) == 10

    response = await auth_client.get(f"/api/v1/news/{folder.id}/news?size=10&page=2")
    assert response.status_code == 200

    response_data = response.json()
    assert response_data['total'] == 15
    assert len(response_data['items']) == 5

    assert response_data['items'][0]['title'] == "title 10"
    assert response_data['items'][4]['title'] == "title 14"


async def test_not_auth(client: AsyncClient, folder: FolderModel):
    response = await client.get(f"/api/v1/news/{folder.id}/news")
    assert response.status_code == 403
    assert response.json() == {'detail': 'Not authenticated'}


async def test_folder_not_found(auth_client: AsyncClient):
    response = await auth_client.get(f"/api/v1/news/{uuid4()}/news")
    assert response.status_code == 404
    assert response.json() == {'detail': 'Not found'}


async def test_other_user_folder(
    auth_client: AsyncClient,
    db_session: AsyncSession,
    other_test_user: UserModel
):
    folder = FolderModel(
        title="test folder",
        user_id=other_test_user.id
    )
    db_session.add(folder)
    await db_session.commit()

    response = await auth_client.get(f"/api/v1/news/{folder.id}/news")
    assert response.status_code == 404
    assert response.json() == {'detail': 'Not found'}
