from sqlalchemy import select

from fastapi_pagination.ext.sqlalchemy import paginate
from src.common.services import AbstractRepositoryService
from src.news.models import NewsModel


class NewsQuery(AbstractRepositoryService):
    async def get_list_news(self):
        query = select(NewsModel).order_by(NewsModel.published_at.desc())

        return await paginate(self.db_session, query)
