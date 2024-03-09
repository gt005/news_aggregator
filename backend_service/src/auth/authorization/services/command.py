from src.auth.authorization.consts import AUTHORIZATION_TOKEN_LIFETIME, AUTHORIZATION_TOKEN_REDIS_KEY_PREFIX
from src.auth.authorization.domain import AuthorizationToken
import secrets
from src.redis import redis_storage


class AuthorizationTokenCommand:
    def _generate_token(self) -> str:
        return secrets.token_urlsafe(32)

    async def create_for_email(self, email: str) -> AuthorizationToken:
        auth_token = self._generate_token()

        await redis_storage.setex(
            f'{AUTHORIZATION_TOKEN_REDIS_KEY_PREFIX}:{email}',
            AUTHORIZATION_TOKEN_LIFETIME,
            auth_token
        )

        return AuthorizationToken(email=email, token=auth_token)

    async def delete_for_email(self, email: str) -> None:
        await redis_storage.delete(f'{AUTHORIZATION_TOKEN_REDIS_KEY_PREFIX}:{email}')
