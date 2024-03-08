from pydantic import BaseModel


class FolderCreateSchema(BaseModel):
    title: str
