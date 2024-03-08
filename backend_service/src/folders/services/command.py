from uuid import uuid4
from src.folders.models import FolderModel
from src.folders.exceptions import FolderWithSuchTitleAlreadyExists
from src.folders.services.query import FolderQuery
from src.common.services import AbstractRepositoryService
from src.folders.domain import Folder
from src.users.models import UserModel


class FolderCommand(AbstractRepositoryService):
    async def create(self, *, user: UserModel, title: str) -> Folder:
        query_service = FolderQuery(db_session=self.db_session)

        existed_folder = await query_service.get_by_user_id_and_title(
            user_id=user.id,
            title=title
        )
        if existed_folder:
            raise FolderWithSuchTitleAlreadyExists()

        folder = FolderModel(
            id=uuid4(),
            user_id=user.id,
            title=title
        )

        self.db_session.add(folder)
        # TODO: Add commit?

        return Folder(
            id=folder.id,
            user_id=folder.user_id,
            title=folder.title
        )
