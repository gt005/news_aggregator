from pydantic import BaseModel, EmailStr

from auth.authorization.custom_types import Password


class AuthUser(BaseModel):
    email: EmailStr
    name: str
    password: Password
