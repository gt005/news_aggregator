from uuid import UUID

from sqlalchemy import select

from src.common.services import AbstractRepositoryService
from src.folders.domain import Folder
from src.folders.models import FolderModel, FolderNewsModels


class FolderQuery(AbstractRepositoryService):
    async def get_by_id(self, *, id: UUID) -> Folder | None:
        query = select(FolderModel).where(FolderModel.id == id)

        query_result = await self.db_session.scalar(query)
        return Folder.from_orm(query_result) if query_result else None

    async def get_by_user_id(self, *, user_id: UUID) -> list[Folder]:
        query = select(FolderModel).where(FolderModel.user_id == user_id)

        query_result = await self.db_session.scalars(query)
        return [Folder.from_orm(folder) for folder in query_result]

    async def get_by_user_id_and_title(self, *, user_id: UUID, title: str) -> Folder | None:
        query = select(FolderModel).where(
            FolderModel.user_id == user_id,
            FolderModel.title == title
        )

        query_result = await self.db_session.scalar(query)
        return Folder.from_orm(query_result) if query_result else None

    async def get_news_ids_by_folder_id(self, *, folder_id: UUID) -> list[UUID]:
        query = select(FolderNewsModels.news_id).where(FolderNewsModels.folder_id == folder_id)

        query_result = await self.db_session.scalars(query)
        return list(query_result.all())
