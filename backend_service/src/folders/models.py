from uuid import UUID

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.database.models import BaseMixin


class FolderModel(BaseMixin):
    __tablename__ = 'folders'
    title: Mapped[str] = mapped_column(String(length=255))
    user_id: Mapped[UUID] = mapped_column(ForeignKey('users.id'))
    folder_news: Mapped[list['FolderNewsModels']] = relationship(
        'FolderNewsModels',
        back_populates='folder'
    )


class FolderNewsModels(BaseMixin):
    __tablename__ = 'folder_news'
    folder_id: Mapped[UUID] = mapped_column(ForeignKey('folders.id'))
    news_id: Mapped[UUID] = mapped_column(ForeignKey('news.id'))
    folder = relationship('FolderModel', back_populates='folder_news')
    news = relationship('NewsModel', back_populates='news_folders')
