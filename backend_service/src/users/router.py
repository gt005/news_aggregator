from uuid import UUID

from fastapi import APIRouter, Depends

from src.common.dependencies import (
    get_current_user_id_from_access_token,
    get_repository,
)
from src.exceptions import BadRequest
from src.users.schemas import UserPublicSchema
from src.users.services.query import UserQuery


user_v1_router = APIRouter(tags=['users'])


@user_v1_router.get('/me')
async def me(
    user_id: UUID = Depends(get_current_user_id_from_access_token),
    user_query: UserQuery = Depends(get_repository(UserQuery))
) -> UserPublicSchema:
    user = await user_query.get_by_id(user_id=user_id)

    if user is None:
        raise BadRequest()

    return UserPublicSchema(**user.model_dump())
