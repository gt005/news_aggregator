from datetime import datetime
from enum import Enum
from uuid import UUID

from pydantic import BaseModel, HttpUrl


class NewsSource(Enum):
    RBC = "rbc"
    TELEGRAM = "telegram"


class News(BaseModel):
    id: UUID
    title: str
    url: HttpUrl
    source: NewsSource
    description: str
    published_at: datetime

    class Config:
        from_attributes = True
