from fastapi import APIRouter, Depends

from src.auth.authorization.dependencies import get_validated_registration_user
from src.auth.authorization.domain import JWT
from src.auth.authorization.schemas import LoginUserSchema, RegisterUserSchema
from src.auth.authorization.services.auth_token.command import AuthorizationTokenCommand
from src.auth.authorization.services.auth_token.query import AuthorizationTokenQuery
from src.auth.authorization.services.jwt.command import JWTCommand
from src.common.dependencies import get_header_token_string, get_repository
from src.common.exceptions import IncorrectHeaderTokenSchema
from src.users.services.command import UserCommand
from src.users.services.query import UserQuery


authorization_v1_router = APIRouter(tags=['authorization'])


@authorization_v1_router.post('/registration')
async def registration(
    register_user_schema: RegisterUserSchema = Depends(get_validated_registration_user),
    authorization_token: str = Depends(get_header_token_string),
    user_command: UserCommand = Depends(get_repository(UserCommand))
) -> JWT:
    auth_token = await AuthorizationTokenQuery().get_by_email(email=register_user_schema.email)
    if auth_token is None or auth_token.token != authorization_token:
        raise IncorrectHeaderTokenSchema()

    user = await user_command.create(
        email=register_user_schema.email,
        name=register_user_schema.name,
        password=register_user_schema.password
    )

    await AuthorizationTokenCommand().delete_for_email(email=register_user_schema.email)
    jwt = JWTCommand().create(user_id=user.id)
    return jwt


@authorization_v1_router.post('/login')
async def login(
    login_user_schema: LoginUserSchema,
    user_query: UserQuery = Depends(get_repository(UserQuery))
) -> JWT:
    user = await user_query.get_by_email(email=login_user_schema.email)
    if user is None or not user.verify_password(
        login_user_schema.password,
        user.hashed_password
    ):
        raise IncorrectHeaderTokenSchema()

    return JWTCommand().create(user_id=user.id)
