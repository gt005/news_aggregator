from uuid import UUID, uuid4

from sqlalchemy import delete, update

from src.common.services import AbstractRepositoryService
from src.folders.domain import Folder
from src.folders.exceptions import FolderWithSuchTitleAlreadyExists
from src.folders.models import FolderModel, FolderNewsModels
from src.folders.services.query import FolderQuery


class FolderCommand(AbstractRepositoryService):
    async def create(self, *, user_id: UUID, title: str) -> Folder:
        query_service = FolderQuery(db_session=self.db_session)

        existed_folder = await query_service.get_by_user_id_and_title(
            user_id=user_id,
            title=title
        )
        if existed_folder:
            raise FolderWithSuchTitleAlreadyExists()

        folder = FolderModel(
            id=uuid4(),
            user_id=user_id,
            title=title
        )

        self.db_session.add(folder)
        await self.db_session.commit()

        return Folder(
            id=folder.id,
            user_id=folder.user_id,
            title=folder.title
        )

    async def update_by_id(self, *, id: UUID, title: str) -> Folder:
        query = (
            update(FolderModel)
            .where(FolderModel.id == id)
            .values(title=title)
            .returning(FolderModel.id, FolderModel.user_id, FolderModel.title)
        )

        query_result = await self.db_session.execute(query)
        folder = query_result.fetchone()

        return Folder(
            id=folder[0],
            user_id=folder[1],
            title=folder[2]
        )

    async def delete_by_id(self, *, id: UUID) -> None:
        query = delete(FolderModel).where(FolderModel.id == id)

        await self.db_session.execute(query)
        await self.db_session.commit()

    async def add_news_to_folder(self, *, folder_id: UUID, news_id: UUID) -> None:
        folder_news = FolderNewsModels(
            folder_id=folder_id,
            news_id=news_id
        )

        self.db_session.add(folder_news)
        await self.db_session.commit()

    async def remove_news_from_folder(self, *, folder_id: UUID, news_id: UUID) -> None:
        query = delete(FolderNewsModels).where(
            FolderNewsModels.folder_id == folder_id,
            FolderNewsModels.news_id == news_id
        )

        await self.db_session.execute(query)
        await self.db_session.commit()
