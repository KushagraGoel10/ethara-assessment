import os
from dataclasses import dataclass

from dotenv import load_dotenv


load_dotenv()


@dataclass(frozen=True)
class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")
    APP_NAME: str = os.getenv("APP_NAME", "Seat Allocation API")
    API_PREFIX: str = os.getenv("API_PREFIX", "/api/v1")


settings = Settings()
