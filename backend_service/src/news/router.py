from uuid import UUID

from fastapi import APIRouter, Depends
from fastapi_pagination import Page

from src.common.dependencies import (
    get_current_user_id_from_access_token,
    get_header_token_string,
    get_repository,
)
from src.common.exceptions import IncorrectHeaderTokenSchema
from src.exceptions import NotFound
from src.folders.services.query import FolderQuery
from src.news.domain import News
from src.news.schemas import NewsCreateSchema
from src.news.services.news.command import NewsCommand
from src.news.services.news.query import NewsQuery
from src.news.services.news_token.command import NewsTokenCommand
from src.news.services.news_token.query import NewsTokenQuery


news_v1_router = APIRouter(tags=["news"])


@news_v1_router.get("/")
async def get_list_news(news_query: NewsQuery = Depends(get_repository(NewsQuery))) -> Page[News]:
    result = await news_query.get_list_news()

    return result


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


@news_v1_router.get('/{folder_id}/news')
async def get_news_list_by_folder_id(
    folder_id: UUID,
    user_id: UUID = Depends(get_current_user_id_from_access_token),
    folder_query: FolderQuery = Depends(get_repository(FolderQuery)),
    news_query: NewsQuery = Depends(get_repository(NewsQuery))
) -> Page[News]:
    """
    Note: This endpoint is not related to one of apps(folders and news),
    it should be in a separate app in microservices architecture or be Facade pattern.
    """
    existed_folder = await folder_query.get_by_id(id=folder_id)
    if not existed_folder or existed_folder.user_id != user_id:
        raise NotFound()

    news_list = await news_query.get_by_folder_id(folder_id=folder_id)

    return news_list
