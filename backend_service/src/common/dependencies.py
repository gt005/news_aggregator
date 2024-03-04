from typing import AsyncGenerator, Callable

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.common.services import AbstractRepositoryService
from src.database.session import async_session


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
