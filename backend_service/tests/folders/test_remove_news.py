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
    news_in_folder: NewsModel
):
    response = await auth_client.delete(
        f"/api/v1/folders/{folder.id}/remove-news/{news_in_folder.id}"
    )
    assert response.status_code == 204

    deleted_folder = await db_session.scalar(
        select(FolderNewsModels)
        .where(
            FolderNewsModels.folder_id == folder.id,
            FolderNewsModels.news_id == news_in_folder.id
        )
    )
    assert deleted_folder is None


async def test_not_auth_user(client: AsyncClient, folder: FolderModel, news: NewsModel):
    response = await client.delete(f"/api/v1/folders/{folder.id}/remove-news/{news.id}")
    assert response.status_code == 403
    assert response.json() == {"detail": "Not authenticated"}


async def test_not_found_folder(
    auth_client: AsyncClient,
    news: NewsModel
):
    response = await auth_client.delete(f"/api/v1/folders/{uuid4()}/remove-news/{news.id}")
    assert response.status_code == 404
    assert response.json() == {"detail": "Not found"}


async def test_not_found_news(
    auth_client: AsyncClient,
    folder: FolderModel
):
    response = await auth_client.delete(f"/api/v1/folders/{folder.id}/remove-news/{uuid4()}")
    assert response.status_code == 404
    assert response.json() == {"detail": "Not found"}
