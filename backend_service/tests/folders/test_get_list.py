from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from src.folders.models import FolderModel


async def test_valid_case(auth_client: AsyncClient, db_session: AsyncSession, folder: FolderModel):
    other_folder = FolderModel(title="other_folder", user_id=folder.user_id)
    db_session.add(other_folder)
    await db_session.commit()

    response = await auth_client.get("/api/v1/folders/")
    assert response.status_code == 200

    folders = response.json()
    assert len(folders) == 2

    assert folders[0]['id'] == str(folder.id)
    assert folders[0]['title'] == folder.title

    assert folders[1]['id'] == str(other_folder.id)
    assert folders[1]['title'] == other_folder.title


async def test_not_auth_user(client: AsyncClient):
    response = await client.get("/api/v1/folders/")
    assert response.status_code == 403
    assert response.json() == {"detail": "Not authenticated"}
