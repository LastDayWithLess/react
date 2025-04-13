from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    POSTGRES_HOST: str
    POSTGRES_PORT: int
    POSTGRES_DB: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    SECRET_KEY: str
    ALGORITHM: str
    email: str

    @property
    def POSTGRES_get_url(self):
        return f'postgresql+psycopg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}'
    
    model_config = SettingsConfigDict(env_file=".env")

    @property
    def get_auth_data(self):
        return {"secret_key": self.SECRET_KEY, "algorithm": self.ALGORITHM}

settings = Settings()