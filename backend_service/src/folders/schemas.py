from uuid import UUID
from pydantic import BaseModel


class FolderPublicSchema(BaseModel):
    id: UUID
    title: str


class FolderCreateSchema(BaseModel):
    title: str
