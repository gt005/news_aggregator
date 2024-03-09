import redis.asyncio
from settings import settings
import redis

redis_storage = redis.asyncio.from_url(settings.REDIS_URL, decode_responses=True)
