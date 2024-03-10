from httpx import AsyncClient
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.folders.models import FolderModel
from src.users.models import UserModel


async def test_valid_case(auth_client: AsyncClient, db_session: AsyncSession, folder: FolderModel):
    old_id = folder.id

    response = await auth_client.put(f"/api/v1/folders/{folder.id}", json={"title": "new_title"})
    assert response.status_code == 200

    updated_folder = await db_session.scalar(select(FolderModel).where(FolderModel.id == folder.id))
    assert updated_folder.id == old_id
    assert updated_folder.title == "new_title"


async def test_other_user_folder(
    auth_client: AsyncClient,
    db_session: AsyncSession,
    other_test_user: UserModel,
    folder: FolderModel
):
    folder.user_id = other_test_user.id
    await db_session.commit()

    response = await auth_client.put(f"/api/v1/folders/{folder.id}", json={"title": "new_title"})
    assert response.status_code == 404
    assert response.json() == {"detail": "Not found"}


async def test_not_auth_user(client: AsyncClient, folder: FolderModel):
    response = await client.put(f"/api/v1/folders/{folder.id}", json={"title": "new_title"})
    assert response.status_code == 403
    assert response.json() == {"detail": "Not authenticated"}
