from datetime import datetime
from uuid import uuid4

from fastapi import APIRouter, File, UploadFile

from app.models.schemas import ImageUploadResponse
from app.services.image_service import image_service
from app.utils.image_validator import validate_upload_file

router = APIRouter()


@router.post("", response_model=ImageUploadResponse, summary="Upload and validate an image")
async def upload_image(file: UploadFile = File(...)) -> ImageUploadResponse:
    image_bytes = await validate_upload_file(file)
    image = image_service.process_upload(image_bytes)
    thumbnail_data_url = image_service.generate_thumbnail_data_url(image)

    return ImageUploadResponse(
        upload_id=str(uuid4()),
        filename=file.filename or "upload.jpg",
        content_type=file.content_type or "image/jpeg",
        width=image.width,
        height=image.height,
        size_bytes=len(image_bytes),
        thumbnail_url=thumbnail_data_url,
        uploaded_at=datetime.utcnow(),
    )