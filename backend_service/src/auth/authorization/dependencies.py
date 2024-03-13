from fastapi import Depends

from src.auth.authorization.exceptions import EmailTaken
from src.auth.authorization.schemas import RegisterUserSchema
from src.common.dependencies import get_repository
from src.users.services.query import UserQuery


async def get_validated_registration_user(
    user: RegisterUserSchema,
    user_query: UserQuery = Depends(get_repository(UserQuery))
) -> RegisterUserSchema:
    if await user_query.get_by_email(email=user.email):
        raise EmailTaken()

    return user
