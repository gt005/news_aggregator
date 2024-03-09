from src.auth.authorization.consts import AUTHORIZATION_TOKEN_REDIS_KEY_PREFIX
from src.auth.authorization.domain import AuthorizationToken
from src.redis import redis_storage


class AuthorizationTokenQuery:
    async def get_by_email(self, email: str) -> AuthorizationToken | None:
        token = await redis_storage.get(f'{AUTHORIZATION_TOKEN_REDIS_KEY_PREFIX}:{email}')

        if token is None:
            return

        return AuthorizationToken(email=email, token=token)
