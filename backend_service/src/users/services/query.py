from sqlalchemy import select
from src.common.services import AbstractRepositoryService
from src.users.domain import User
from src.users.models import UserModel


class UserQuery(AbstractRepositoryService):
    async def get_user_by_email(self, *, email: str) -> User | None:
        query = select(UserModel).where(UserModel.email == email)
        user: UserModel = await self.db_session.scalar(query)

        if user is None:
            return

        return User(id=user.id, email=user.email, name=user.name)
