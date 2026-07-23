import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.db.database import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class CaptionRecord(Base):
    __tablename__ = "captions"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=True, index=True)
    caption = Column(String, nullable=False)
    confidence = Column(Float, nullable=False, default=0.0)
    language = Column(String, nullable=False, default="en")
    thumbnail_url = Column(String, nullable=True)
    processing_time_ms = Column(Integer, nullable=False, default=0)
    original_filename = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("UserRecord", back_populates="captions")


class UserRecord(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, nullable=False, index=True)
    name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    plan = Column(String, nullable=False, default="free")
    captions_used = Column(Integer, nullable=False, default=0)
    captions_limit = Column(Integer, nullable=False, default=50)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    captions = relationship("CaptionRecord", back_populates="user")