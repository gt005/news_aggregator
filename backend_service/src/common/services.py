from sqlalchemy.ext.asyncio import AsyncSession


class AbstractRepositoryService:
    db_session: AsyncSession

    def __init__(self, db_session):
        self.db_session = db_session
