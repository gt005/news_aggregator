from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, HttpUrl


class News(BaseModel):
    id: UUID
    title: str
    url: HttpUrl
    description: str
    published_at: datetime
