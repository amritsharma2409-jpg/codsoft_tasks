from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # App
    APP_NAME: str = "VisionCaption AI"
    APP_ENV: str = "development"
    DEBUG: bool = True
    API_V1_PREFIX: str = "/api/v1"

    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "https://visioncaption.ai",
        "https://www.visioncaption.ai",
    ]

    # Security
    SECRET_KEY: str = "change-this-secret-key-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./visioncaption.db"

    # Caption Model (BLIP)
    MODEL_NAME: str = "Salesforce/blip-image-captioning-base"
    MODEL_CACHE_DIR: str = "./model_cache"
    MODEL_DEVICE: str = "cpu"
    MAX_CAPTION_LENGTH: int = 50
    MIN_CAPTION_LENGTH: int = 5
    NUM_BEAMS: int = 4

    # Hugging Face Inference API (used instead of loading the BLIP model locally,
    # so the backend can run on low-RAM free hosting tiers like Render's free plan)
    # NOTE: never hardcode the real token here -- it is loaded from the .env file
    # locally, and from Render's Environment Variables in production.
    HF_API_TOKEN: str = ""

    # OCR Model (TrOCR)
    OCR_MODEL_NAME: str = "microsoft/trocr-base-printed"
    OCR_MAX_LENGTH: int = 128
    ENABLE_OCR: bool = True

    # Object Detection Model (DETR)
    DETECTION_MODEL_NAME: str = "facebook/detr-resnet-50"
    DETECTION_CONFIDENCE_THRESHOLD: float = 0.7
    MAX_DETECTED_OBJECTS: int = 20
    ENABLE_OBJECT_DETECTION: bool = True

    # Upload limits
    MAX_UPLOAD_SIZE_MB: int = 10
    ALLOWED_IMAGE_TYPES: List[str] = ["image/jpeg", "image/png", "image/webp"]

    # Rate limiting
    RATE_LIMIT_FREE_PER_MONTH: int = 50
    RATE_LIMIT_PRO_PER_MONTH: int = 2000
    RATE_LIMIT_PER_MINUTE: str = "20/minute"

    # Logging
    LOG_LEVEL: str = "INFO"

    @property
    def max_upload_size_bytes(self) -> int:
        return self.MAX_UPLOAD_SIZE_MB * 1024 * 1024

    @property
    def is_production(self) -> bool:
        return self.APP_ENV == "production"


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
