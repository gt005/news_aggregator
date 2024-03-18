from uuid import UUID

from fastapi import APIRouter, Depends

from src.common.dependencies import (
    get_current_user_id_from_access_token,
    get_repository,
)
from src.exceptions import NotFound
from src.folders.exceptions import FolderAlreadyContainsNews
from src.folders.schemas import FolderCreateSchema, FolderPublicSchema
from src.folders.services.command import FolderCommand
from src.folders.services.query import FolderQuery
from src.news.services.news.query import NewsQuery


folders_v1_router = APIRouter(tags=['folders'])


@folders_v1_router.get('/')
async def get_folder_list(
    user_id: UUID = Depends(get_current_user_id_from_access_token),
    folder_query: FolderQuery = Depends(get_repository(FolderQuery)),
) -> list[FolderPublicSchema]:
    folders = await folder_query.get_by_user_id(user_id=user_id)

    return folders


@folders_v1_router.get('/{folder_id}')
async def get_folder_detail(
    folder_id: UUID,
    user_id: UUID = Depends(get_current_user_id_from_access_token),
    folder_query: FolderQuery = Depends(get_repository(FolderQuery)),
) -> FolderPublicSchema:
    folder = await folder_query.get_by_id(id=folder_id)
    if not folder or folder.user_id != user_id:
        raise NotFound()

    return folder


@folders_v1_router.post('/', status_code=201)
async def create_folder(
    folder_create_schema: FolderCreateSchema,
    user_id: UUID = Depends(get_current_user_id_from_access_token),
    folder_command: FolderCommand = Depends(get_repository(FolderCommand))
) -> FolderPublicSchema:
    folder = await folder_command.create(user_id=user_id, title=folder_create_schema.title)

    return folder


@folders_v1_router.put('/{folder_id}')
async def update_folder(
    folder_id: UUID,
    folder_create_schema: FolderCreateSchema,
    user_id: UUID = Depends(get_current_user_id_from_access_token),
    folder_command: FolderCommand = Depends(get_repository(FolderCommand)),
    folder_query: FolderQuery = Depends(get_repository(FolderQuery))
) -> FolderPublicSchema:
    existed_folder = await folder_query.get_by_id(id=folder_id)
    if not existed_folder or existed_folder.user_id != user_id:
        raise NotFound()

    folder = await folder_command.update_by_id(id=folder_id, title=folder_create_schema.title)

    return folder


@folders_v1_router.delete('/{folder_id}', status_code=204)
async def delete_folder(
    folder_id: UUID,
    user_id: UUID = Depends(get_current_user_id_from_access_token),
    folder_command: FolderCommand = Depends(get_repository(FolderCommand)),
    folder_query: FolderQuery = Depends(get_repository(FolderQuery))
) -> None:
    existed_folder = await folder_query.get_by_id(id=folder_id)
    if not existed_folder or existed_folder.user_id != user_id:
        raise NotFound()

    await folder_command.delete_by_id(id=folder_id)

    return None


@folders_v1_router.post('/{folder_id}/add-news/{news_id}', status_code=204)
async def add_news_to_folder(
    folder_id: UUID,
    news_id: UUID,
    user_id: UUID = Depends(get_current_user_id_from_access_token),
    folder_command: FolderCommand = Depends(get_repository(FolderCommand)),
    folder_query: FolderQuery = Depends(get_repository(FolderQuery)),
    news_query: NewsQuery = Depends(get_repository(NewsQuery))
) -> None:
    existed_folder = await folder_query.get_by_id(id=folder_id)
    if not existed_folder or existed_folder.user_id != user_id:
        raise NotFound()

    existed_news = await news_query.get_by_id(id=news_id)
    if not existed_news:
        raise NotFound()

    news_in_folder = await folder_query.get_news_ids_by_folder_id(folder_id=folder_id)
    if news_id in news_in_folder:
        raise FolderAlreadyContainsNews()

    folder = await folder_command.add_news_to_folder(folder_id=folder_id, news_id=news_id)

    return folder


@folders_v1_router.delete('/{folder_id}/remove-news/{news_id}', status_code=204)
async def remove_news_from_folder(
    folder_id: UUID,
    news_id: UUID,
    user_id: UUID = Depends(get_current_user_id_from_access_token),
    folder_command: FolderCommand = Depends(get_repository(FolderCommand)),
    folder_query: FolderQuery = Depends(get_repository(FolderQuery))
) -> None:
    existed_folder = await folder_query.get_by_id(id=folder_id)
    if not existed_folder or existed_folder.user_id != user_id:
        raise NotFound()

    if news_id not in await folder_query.get_news_ids_by_folder_id(folder_id=folder_id):
        raise NotFound()

    await folder_command.remove_news_from_folder(folder_id=folder_id, news_id=news_id)
    return None
