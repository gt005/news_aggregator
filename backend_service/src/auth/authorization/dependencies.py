from fastapi import Depends, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from src.auth.authorization.exceptions import (
    EmailTaken,
    IncorrectAuthorizationTokenSchema,
)
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


async def get_authorization_token_string(
    token: HTTPAuthorizationCredentials = Security(HTTPBearer())
) -> str:
    if not token or token.scheme.lower() != 'bearer' or token.credentials is None:
        raise IncorrectAuthorizationTokenSchema()

    return token.credentials
