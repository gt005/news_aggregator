from httpx import AsyncClient
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.folders.models import FolderModel
from src.users.models import UserModel


async def test_valid_case(auth_client: AsyncClient, db_session: AsyncSession, test_user: UserModel):
    response = await auth_client.post("/api/v1/folders/", json={"title": "test"})
    assert response.status_code == 201

    created_folder = await db_session.scalar(
        select(FolderModel).where(FolderModel.title == "test", FolderModel.user_id == test_user.id)
    )
    assert created_folder is not None

    data = response.json()
    assert data["id"] == str(created_folder.id)
    assert data["title"] == "test"
    assert data.get("user_id") is None


async def test_not_auth_user(client: AsyncClient):
    response = await client.post("/api/v1/folders/", json={"title": "test"})
    assert response.status_code == 403
    assert response.json() == {"detail": "Not authenticated"}
