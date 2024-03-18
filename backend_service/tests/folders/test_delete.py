from httpx import AsyncClient
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.folders.models import FolderModel
from src.news.models import NewsModel
from src.users.models import UserModel


async def test_valid_case(auth_client: AsyncClient, db_session: AsyncSession, folder: FolderModel):
    response = await auth_client.delete(f"/api/v1/folders/{folder.id}")
    assert response.status_code == 204

    deleted_folder = await db_session.scalar(select(FolderModel).where(FolderModel.id == folder.id))
    assert deleted_folder is None


async def test_other_user_folder(
    auth_client: AsyncClient,
    db_session: AsyncSession,
    test_user: UserModel,
    folder: FolderModel,
    other_test_user: UserModel
):
    folder.user_id = other_test_user.id
    await db_session.commit()

    response = await auth_client.delete(f"/api/v1/folders/{folder.id}")
    assert response.status_code == 404
    assert response.json() == {"detail": "Not found"}


async def test_not_auth_user(client: AsyncClient, folder: FolderModel):
    response = await client.delete(f"/api/v1/folders/{folder.id}")
    assert response.status_code == 403
    assert response.json() == {"detail": "Not authenticated"}


async def test_delete_with_news(
    auth_client: AsyncClient,
    db_session: AsyncSession,
    folder: FolderModel,
    news_in_folder: NewsModel
):
    response = await auth_client.delete(f"/api/v1/folders/{folder.id}")
    assert response.status_code == 204

    deleted_folder = await db_session.scalar(select(FolderModel).where(FolderModel.id == folder.id))
    assert deleted_folder is None

    not_deleted_news = await db_session.scalar(
        select(NewsModel).where(NewsModel.id == news_in_folder.id)
    )
    assert not_deleted_news is not None
