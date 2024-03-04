from fastapi import Depends

from auth.authorization.exceptions import EmailTaken
from auth.authorization.schemas import AuthUser
from common.dependencies import get_repository
from users.services.query import UserQuery


async def valid_user_create(
    user: AuthUser,
    user_query: UserQuery = Depends(get_repository(UserQuery))
) -> AuthUser:
    if await user_query.get_user_by_email(email=user.email):
        raise EmailTaken()

    return user
