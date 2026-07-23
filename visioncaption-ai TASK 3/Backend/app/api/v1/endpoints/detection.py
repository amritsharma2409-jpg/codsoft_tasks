from datetime import datetime
from uuid import uuid4

from fastapi import APIRouter, File, UploadFile

from app.models.schemas import ObjectDetectionResponse
from app.services.image_service import image_service
from app.services.object_detection_service import object_detection_service
from app.utils.image_validator import validate_upload_file

router = APIRouter()


@router.post("", response_model=ObjectDetectionResponse, summary="Detect objects in an image")
async def detect_objects(file: UploadFile = File(...)) -> ObjectDetectionResponse:
    image_bytes = await validate_upload_file(file)
    image = image_service.process_upload(image_bytes)

    detected_objects, processing_time_ms = object_detection_service.detect_objects(image)

    return ObjectDetectionResponse(
        id=str(uuid4()),
        objects=detected_objects,
        object_count=len(detected_objects),
        processing_time_ms=processing_time_ms,
        image_width=image.width,
        image_height=image.height,
        created_at=datetime.utcnow(),
    )