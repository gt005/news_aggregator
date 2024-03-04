from common.services import AbstractRepositoryService
from users.domain import User
from users.models import UserModel


class UserQuery(AbstractRepositoryService):
    async def get_user_by_email(self, *, email: str) -> User | None:
        user = await self.db_session.query(UserModel).where(UserModel.email == email).first()

        if user is None:
            return

        return User.from_orm(user)
