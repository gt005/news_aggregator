from pydantic import BaseModel, EmailStr


class AuthorizationToken(BaseModel):
    email: EmailStr
    token: str
