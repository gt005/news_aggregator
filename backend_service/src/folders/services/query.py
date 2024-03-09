from uuid import UUID

from sqlalchemy import select

from src.common.services import AbstractRepositoryService
from src.folders.models import FolderModel


class FolderQuery(AbstractRepositoryService):
    async def get_by_user_id_and_title(self, *, user_id: UUID, title: str) -> FolderModel | None:
        query = select(FolderModel).where(
            FolderModel.user_id == user_id,
            FolderModel.title == title
        )

        return await self.db_session.execute(query).scalar()
