from uuid import UUID

from pydantic import BaseModel, EmailStr


class UserPublicSchema(BaseModel):
    id: UUID
    name: str
    email: EmailStr
