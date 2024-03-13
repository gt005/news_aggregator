from src.news.consts import CREATE_NEWS_TOKEN_REDIS_KEY_PREFIX
from src.news.domain import NewsHeaderToken
from src.redis import redis_storage


class NewsTokenQuery:
    async def get_token(self, *, token: str) -> NewsHeaderToken | None:
        token = await redis_storage.get(f'{CREATE_NEWS_TOKEN_REDIS_KEY_PREFIX}:{token}')

        if token is None:
            return

        return NewsHeaderToken(token=token)
