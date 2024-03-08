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

    @property
    def DB_URL(self) -> str:
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}" \
               f"@{self.DB_HOST}/{self.POSTGRES_DB}"

    @property
    def TEST_DB_URL(self) -> str:
        return f"postgresql+asyncpg://{self.POSTGRES_USER_TEST}:{self.POSTGRES_PASSWORD_TEST}" \
               f"@{self.DB_HOST_TEST}/{self.POSTGRES_DB_TEST}"

    class Config:
        env_file = ".env"


settings = Settings()
