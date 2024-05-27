from src.news.consts import CREATE_NEWS_TOKEN_REDIS_KEY_PREFIX
from src.redis import redis_storage


class NewsTokenCommand:
    async def delete(self, *, token: str) -> None:
        await redis_storage.delete(f'{CREATE_NEWS_TOKEN_REDIS_KEY_PREFIX}:{token}')
