import os

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Main database settings
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    DB_HOST: str

    # Test database settings
    POSTGRES_USER_TEST: str
    POSTGRES_PASSWORD_TEST: str
    POSTGRES_DB_TEST: str
    DB_HOST_TEST: str

    # Redis settings
    REDIS_HOST: str
    REDIS_PORT: int
    REDIS_KEY_PREFIX: str

    # Email settings
    SENDER_EMAIL_OTP_CODES_EMAIL: str
    SENDER_EMAIL_HOST_PASSWORD: str
    SENDER_EMAIL_HOST: str
    SENDER_EMAIL_PORT: int

    # Auth settings
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str
    ACCESS_TOKEN_LIFETIME: int
    REFRESH_TOKEN_LIFETIME: int
    OTP_CODE_LIFETIME: int
    AUTHORIZATION_TOKEN_LIFETIME: int

    # News settings
    CREATE_NEWS_TOKEN_LIFETIME: int

    @property
    def DB_URL(self) -> str:
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}" \
               f"@{self.DB_HOST}/{self.POSTGRES_DB}"

    @property
    def TEST_DB_URL(self) -> str:
        return f"postgresql+asyncpg://{self.POSTGRES_USER_TEST}:{self.POSTGRES_PASSWORD_TEST}" \
               f"@{self.DB_HOST_TEST}/{self.POSTGRES_DB_TEST}"

    @property
    def REDIS_URL(self) -> str:
        return f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}/0"

    class Config:
        env_file = ".env" if os.path.isfile(".env") else ".env.example"


settings = Settings()
