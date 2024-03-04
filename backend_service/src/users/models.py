from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from src.database.models import BaseMixin


class UserModel(BaseMixin):
    __tablename__ = "users"
    email: Mapped[str] = mapped_column(String(length=255))
    name: Mapped[str] = mapped_column(String(length=255))
    password_salt: Mapped[str]
    hashed_password: Mapped[str]
