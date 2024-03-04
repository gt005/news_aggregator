from sqlalchemy import select

from src.common.services import AbstractRepositoryService
from src.news.models import NewsModel


class NewsQuery(AbstractRepositoryService):
    async def get_list_news(self) -> list[NewsModel]:
        query = select(NewsModel).order_by(NewsModel.published_at.desc())

        return (await self.db_session.execute(query)).scalars().all()
