from datetime import datetime

from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.database.models import BaseMixin
from src.folders.models import FolderNewsModels


class NewsModel(BaseMixin):
    __tablename__ = 'news'
    title: Mapped[str]
    url: Mapped[str] = mapped_column(unique=True)
    description: Mapped[str]
    published_at: Mapped[datetime]
    folder_news: Mapped[list[FolderNewsModels]] = relationship(back_populates="news")
