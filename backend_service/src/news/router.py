from fastapi import APIRouter, Depends
from fastapi_pagination import Page, paginate

from src.common.dependencies import get_repository
from src.news.domain import News
from src.news.services.query import NewsQuery


news_v1_router = APIRouter(tags=["news"])


@news_v1_router.get("/")
async def get_list_news(
    news_query: NewsQuery = Depends(get_repository(NewsQuery)),
) -> Page[News]:
    return paginate(await news_query.get_list_news())
