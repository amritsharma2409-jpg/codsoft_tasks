from fastapi import APIRouter

from app.models.schemas import HealthResponse, ModelStatus
from app.services.blip_service import blip_service
from app.services.object_detection_service import object_detection_service
from app.services.ocr_service import ocr_service

router = APIRouter()


@router.get("", response_model=HealthResponse, summary="Health check")
async def health_check() -> HealthResponse:
    return HealthResponse(
        status="ok" if blip_service.is_ready else "starting",
        model_loaded=blip_service.is_ready,
        device=str(blip_service.device),
        version="1.0.0",
    )


@router.get("/ready", summary="Readiness probe")
async def readiness_check() -> dict:
    return {"ready": blip_service.is_ready}


@router.get("/models", response_model=ModelStatus, summary="AI model readiness status")
async def models_status() -> ModelStatus:
    return ModelStatus(
        caption_model_ready=blip_service.is_ready,
        ocr_model_ready=ocr_service.is_ready,
        detection_model_ready=object_detection_service.is_ready,
    )