from fastapi import APIRouter, Depends

from src.common.dependencies import get_header_token_string, get_repository
from src.common.exceptions import IncorrectHeaderTokenSchema
from src.news.schemas import NewsCreateSchema
from src.news.services.news.command import NewsCommand
from src.news.services.news_token.command import NewsTokenCommand
from src.news.services.news_token.query import NewsTokenQuery


news_v1_router = APIRouter(tags=["news"])


@news_v1_router.post("/list", status_code=201)
async def create_news_list(
    news: list[NewsCreateSchema],
    token: str = Depends(get_header_token_string),
    news_command: NewsCommand = Depends(get_repository(NewsCommand)),
) -> None:
    news_create_token = await NewsTokenQuery().get_token(token=token)
    if news_create_token is None:
        raise IncorrectHeaderTokenSchema()

    await news_command.create_news_list(news=news)

    await NewsTokenCommand().delete(token=news_create_token)
