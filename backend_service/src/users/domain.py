from uuid import UUID

from pydantic import BaseModel, EmailStr


class User(BaseModel):
    id: UUID
    name: str
    email: EmailStr
