from uuid import uuid4
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from httpx import AsyncClient

from src.folders.models import FolderModel, FolderNewsModels
from src.news.models import NewsModel


async def test_valid_case(
    auth_client: AsyncClient,
    db_session: AsyncSession,
    folder: FolderModel,
    news: NewsModel
):
    response = await auth_client.post(f"api/v1/folders/{folder.id}/add-news/{news.id}")

    assert response.status_code == 204

    folder_news = await db_session.execute(
        select(FolderNewsModels)
        .where(FolderNewsModels.folder_id == folder.id, FolderNewsModels.news_id == news.id)
    )
    folder_news = folder_news.scalars().first()

    assert folder_news is not None


async def test_not_auth_user(client: AsyncClient, folder: FolderModel, news: NewsModel):
    response = await client.post(f"api/v1/folders/{folder.id}/add-news/{news.id}")

    assert response.status_code == 403
    assert response.json() == {"detail": "Not authenticated"}


async def test_not_found_folder(
    auth_client: AsyncClient,
    news: NewsModel
):
    response = await auth_client.post(f"api/v1/folders/{uuid4()}/add-news/{news.id}")

    assert response.status_code == 404
    assert response.json() == {"detail": "Not found"}


async def test_not_found_news(
    auth_client: AsyncClient,
    folder: FolderModel
):
    response = await auth_client.post(f"api/v1/folders/{folder.id}/add-news/{uuid4()}")

    assert response.status_code == 404
    assert response.json() == {"detail": "Not found"}
