from uuid import uuid4

from src.common.services import AbstractRepositoryService
from src.users.domain import User
from src.users.models import UserModel


class UserCommand(AbstractRepositoryService):
    async def create(self, *, email: str, name: str, password: str) -> User:
        user_model = UserModel(
            id=uuid4(),
            email=email,
            name=name,
            hashed_password=User.hash_password(password)
        )

        self.db_session.add(user_model)
        await self.db_session.commit()

        return User.from_orm(user_model)
