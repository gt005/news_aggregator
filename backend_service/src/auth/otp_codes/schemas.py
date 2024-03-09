from pydantic import BaseModel, EmailStr


class SendOtpCodeSchema(BaseModel):
    email: EmailStr
