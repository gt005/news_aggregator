import time
from uuid import UUID

import jwt

from settings import settings
from src.auth.authorization.domain import JWT


class JWTCommand:
    def create(self, user_id: UUID) -> JWT:
        access_token = jwt.encode(
            {
                "user_id": str(user_id),
                "exp": time.time() + settings.ACCESS_TOKEN_LIFETIME,
                "type": "access"
            },
            settings.JWT_SECRET_KEY,
            algorithm=settings.JWT_ALGORITHM
        )

        refresh_token = jwt.encode(
            {
                "user_id": str(user_id),
                "exp": time.time() + settings.REFRESH_TOKEN_LIFETIME,
                "type": "refresh"
            },
            settings.JWT_SECRET_KEY,
            algorithm=settings.JWT_ALGORITHM
        )

        return JWT(access_token=access_token, refresh_token=refresh_token)
