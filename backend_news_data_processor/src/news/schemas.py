from datetime import datetime

from pydantic import BaseModel, HttpUrl

from src.news.domain import NewsSource


class NewsCreateSchema(BaseModel):
    title: str
    url: HttpUrl
    source: NewsSource
    description: str
    published_at: datetime
