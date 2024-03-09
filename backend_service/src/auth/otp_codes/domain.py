from pydantic import BaseModel, EmailStr


class OtpCode(BaseModel):
    email: EmailStr
    code: int
