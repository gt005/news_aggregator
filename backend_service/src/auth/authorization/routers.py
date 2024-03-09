from fastapi import APIRouter, Depends
from src.auth.authorization.services.command import AuthorizationTokenCommand
from src.common.dependencies import get_repository
from src.auth.authorization.exceptions import InvalidAuthorizationToken
from src.auth.authorization.services.query import AuthorizationTokenQuery
from src.auth.authorization.dependencies import get_authorization_token_string, get_validated_registration_user
from src.auth.authorization.schemas import RegisterUserSchema
from src.users.services.command import UserCommand
from src.users.domain import User


authorization_v1_router = APIRouter(tags=['authorization'])


@authorization_v1_router.post('/registration')
async def registration(
    register_user_schema: RegisterUserSchema = Depends(get_validated_registration_user),
    authorization_token: str = Depends(get_authorization_token_string),
    user_command: UserCommand = Depends(get_repository(UserCommand))
) -> User:
    auth_token = await AuthorizationTokenQuery().get_by_email(email=register_user_schema.email)
    if auth_token is None or auth_token.token != authorization_token:
        raise InvalidAuthorizationToken()

    user = await user_command.create(
        email=register_user_schema.email,
        name=register_user_schema.name,
        password=register_user_schema.password
    )

    await AuthorizationTokenCommand().delete_for_email(email=register_user_schema.email)
    return user
