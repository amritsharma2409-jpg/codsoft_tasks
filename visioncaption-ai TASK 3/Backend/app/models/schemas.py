from datetime import datetime
from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class SupportedLanguage(str, Enum):
    en = "en"
    es = "es"
    fr = "fr"
    de = "de"
    it = "it"
    pt = "pt"
    hi = "hi"
    ja = "ja"
    ko = "ko"
    zh = "zh"


class PlanType(str, Enum):
    free = "free"
    pro = "pro"
    enterprise = "enterprise"


# ---------- Upload ----------

class ImageUploadResponse(BaseModel):
    upload_id: str
    filename: str
    content_type: str
    width: int
    height: int
    size_bytes: int
    thumbnail_url: str
    uploaded_at: datetime


# ---------- Caption ----------

class CaptionRequest(BaseModel):
    language: SupportedLanguage = SupportedLanguage.en
    max_length: int = Field(default=50, ge=5, le=100)


class CaptionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    caption: str
    confidence: float = Field(ge=0.0, le=1.0)
    processing_time_ms: int
    language: SupportedLanguage
    created_at: datetime


class CaptionHistoryItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    caption: str
    thumbnail_url: str
    confidence: float
    language: SupportedLanguage
    created_at: datetime


class CaptionHistoryResponse(BaseModel):
    items: List[CaptionHistoryItem]
    total: int
    page: int
    page_size: int
    has_more: bool


# ---------- OCR ----------

class OCRResponse(BaseModel):
    id: str
    extracted_text: str
    character_count: int
    word_count: int
    processing_time_ms: int
    has_text: bool
    created_at: datetime


# ---------- Object Detection ----------

class BoundingBox(BaseModel):
    x_min: float
    y_min: float
    x_max: float
    y_max: float


class DetectedObject(BaseModel):
    label: str
    confidence: float = Field(ge=0.0, le=1.0)
    bounding_box: BoundingBox


class ObjectDetectionResponse(BaseModel):
    id: str
    objects: List[DetectedObject]
    object_count: int
    processing_time_ms: int
    image_width: int
    image_height: int
    created_at: datetime


# ---------- Health ----------

class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    device: str
    version: str


class ModelStatus(BaseModel):
    caption_model_ready: bool
    ocr_model_ready: bool
    detection_model_ready: bool


# ---------- Auth ----------

class UserRegister(BaseModel):
    name: str = Field(min_length=2, max_length=60)
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    email: EmailStr
    name: str
    plan: PlanType
    captions_used: int
    captions_limit: int
    created_at: datetime


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    expires_in: int
    token_type: str = "bearer"


class AuthResponse(BaseModel):
    user: UserResponse
    tokens: TokenResponse


# ---------- Errors ----------

class ErrorResponse(BaseModel):
    detail: str
    code: Optional[str] = None
    status_code: int