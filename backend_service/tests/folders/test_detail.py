from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from src.folders.models import FolderModel
from src.users.models import UserModel


async def test_valid_case(auth_client: AsyncClient, folder: FolderModel):
    response = await auth_client.get(f"/api/v1/folders/{folder.id}")
    assert response.status_code == 200

    data = response.json()
    assert data["id"] == str(folder.id)
    assert data["title"] == folder.title
    assert data.get("user_id") is None


async def test_other_user_folder(
    auth_client: AsyncClient,
    db_session: AsyncSession,
    test_user: UserModel,
    other_test_user: UserModel,
    folder: FolderModel
):
    folder.user_id = other_test_user.id
    await db_session.commit()

    response = await auth_client.get(f"/api/v1/folders/{folder.id}")
    assert response.status_code == 404
    assert response.json() == {"detail": "Not found"}


async def test_not_auth_user(client: AsyncClient, folder: FolderModel):
    response = await client.get(f"/api/v1/folders/{folder.id}")
    assert response.status_code == 403
    assert response.json() == {"detail": "Not authenticated"}
