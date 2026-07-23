from datetime import datetime
from uuid import uuid4

from fastapi import APIRouter, File, UploadFile

from app.models.schemas import OCRResponse
from app.services.image_service import image_service
from app.services.ocr_service import ocr_service
from app.utils.image_validator import validate_upload_file

router = APIRouter()


@router.post("", response_model=OCRResponse, summary="Extract text from an image")
async def extract_text(file: UploadFile = File(...)) -> OCRResponse:
    image_bytes = await validate_upload_file(file)
    image = image_service.process_upload(image_bytes)

    extracted_text, processing_time_ms = ocr_service.extract_text(image)

    word_count = len(extracted_text.split()) if extracted_text else 0

    return OCRResponse(
        id=str(uuid4()),
        extracted_text=extracted_text,
        character_count=len(extracted_text),
        word_count=word_count,
        processing_time_ms=processing_time_ms,
        has_text=len(extracted_text.strip()) > 0,
        created_at=datetime.utcnow(),
    )