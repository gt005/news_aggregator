from pydantic import BaseModel, EmailStr, validator


class RegisterUserSchema(BaseModel):
    email: EmailStr
    name: str
    password: str

    @validator('password')
    def validate_password(cls, value):
        if len(value) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not any(char.isdigit() for char in value):
            raise ValueError('Password must contain at least one digit')
        if not any(char.isupper() for char in value):
            raise ValueError('Password must contain at least one uppercase letter')
        if not any(char.islower() for char in value):
            raise ValueError('Password must contain at least one lowercase letter')
        return value


class LoginUserSchema(BaseModel):
    email: EmailStr
    password: str
