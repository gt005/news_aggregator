from typing import AsyncGenerator, Callable
from uuid import UUID

import jwt
from fastapi import Depends, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from settings import settings
from src.common.services import AbstractRepositoryService
from src.database.session import async_session
from src.exceptions import NotAuthenticated


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Get Actual db async session to work with db.

    Yields:
        Actual db async Session.
    """
    async with async_session() as session:
        yield session


def get_repository(
    repository: type[AbstractRepositoryService]
) -> Callable[[AsyncSession], AbstractRepositoryService]:
    """
    Creates and returns a service that handles commands or queries
    based on the specified `repository`.

    Args:
        repository: The repository service class to be created. This class should inherit from
            the abstract base class `AbstractRepositoryService`.

    Returns:
        Created specified class to access database.
    """
    def _get_service(db_session: AsyncSession = Depends(get_session)) -> AbstractRepositoryService:
        return repository(db_session)

    return _get_service


def get_current_user_id_from_access_token(
    authorization: HTTPAuthorizationCredentials = Security(HTTPBearer())
) -> UUID:
    if authorization.scheme != "Bearer":
        raise NotAuthenticated()

    try:
        payload = jwt.decode(
            authorization.credentials,
            settings.JWT_SECRET_KEY,
            algorithms=settings.JWT_ALGORITHM
        )
    except jwt.ExpiredSignatureError:
        raise NotAuthenticated()

    user_id: UUID = UUID(payload.get("user_id"))
    token_type: str = payload.get("type")

    if user_id is None or token_type != "access":
        raise NotAuthenticated()

    return user_id
