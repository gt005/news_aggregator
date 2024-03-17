from fastapi_pagination.ext.sqlalchemy import paginate
from sqlalchemy import select

from src.common.services import AbstractRepositoryService
from src.folders.models import FolderNewsModels
from src.news.domain import News
from src.news.models import NewsModel


class NewsQuery(AbstractRepositoryService):
    async def get_list_news(self) -> list[News]:
        query = select(NewsModel).order_by(NewsModel.published_at.desc())

        return await paginate(self.db_session, query)

    async def get_by_id(self, id: str) -> News | None:
        query = select(NewsModel).where(NewsModel.id == id)

        return (await self.db_session.execute(query)).scalar()

    async def get_by_folder_id(self, folder_id: str) -> list[News]:
        query = (
            select(NewsModel)
            .join(FolderNewsModels, NewsModel.id == FolderNewsModels.news_id)
            .where(FolderNewsModels.folder_id == folder_id)
            .order_by(NewsModel.published_at.desc())
        )

        return await paginate(self.db_session, query)
