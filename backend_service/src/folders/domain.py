from uuid import UUID

from pydantic import BaseModel


class Folder(BaseModel):
    id: UUID
    title: str
    user_id: UUID

    class Config:
        from_attributes = True
