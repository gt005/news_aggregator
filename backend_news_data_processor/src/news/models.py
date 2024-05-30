from datetime import datetime

from sqlalchemy.orm import Mapped, mapped_column

from src.database.models import BaseMixin


class NewsModel(BaseMixin):
    __tablename__ = 'news'
    title: Mapped[str]
    url: Mapped[str] = mapped_column(unique=True)
    source: Mapped[str]
    description: Mapped[str]
    published_at: Mapped[datetime]
