from fastapi import APIRouter

from app.api.v1.endpoints import caption, detection, health, history, ocr, upload

api_router = APIRouter()

api_router.include_router(health.router, prefix="/health", tags=["Health"])
api_router.include_router(upload.router, prefix="/upload", tags=["Upload"])
api_router.include_router(caption.router, prefix="/caption", tags=["Caption"])
api_router.include_router(ocr.router, prefix="/ocr", tags=["OCR"])
api_router.include_router(detection.router, prefix="/detect", tags=["Object Detection"])
api_router.include_router(history.router, prefix="/history", tags=["History"])