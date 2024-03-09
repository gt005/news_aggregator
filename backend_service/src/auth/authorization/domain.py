from pydantic import BaseModel, EmailStr


class AuthorizationToken(BaseModel):
    email: EmailStr
    token: str


class JWT(BaseModel):
    access_token: str
    refresh_token: str
