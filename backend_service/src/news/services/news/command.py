from uuid import uuid4

from src.common.services import AbstractRepositoryService
from src.news.domain import News
from src.news.models import NewsModel
from src.news.schemas import NewsCreateSchema


class NewsCommand(AbstractRepositoryService):
    async def create_news_list(self, *, news: list[NewsCreateSchema]) -> list[News]:
        created_news = []

        for news_item in news:
            news_model = NewsModel(
                id=uuid4(),
                title=news_item.title,
                url=str(news_item.url),
                source=news_item.source.value,
                description=news_item.description,
                published_at=news_item.published_at
            )
            created_news.append(news_model)

        news_domains = [News.from_orm(news) for news in created_news]
        self.db_session.add_all(created_news)
        await self.db_session.commit()

        return news_domains
