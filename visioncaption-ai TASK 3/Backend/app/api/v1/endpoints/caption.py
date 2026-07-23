from datetime import datetime
from uuid import uuid4

from fastapi import APIRouter, Depends, File, Form, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.concurrency import run_in_threadpool

from app.dependencies import get_current_user, get_db
from app.models.caption_model import CaptionRecord, UserRecord
from app.models.schemas import CaptionResponse, SupportedLanguage
from app.services.blip_service import blip_service
from app.services.cache_service import cache_service
from app.services.image_service import image_service
from app.utils.image_validator import validate_upload_file
from app.core.logging_config import get_logger

router = APIRouter()
logger = get_logger(__name__)


@router.post("", response_model=CaptionResponse, summary="Generate a caption for an image")
async def generate_caption(
    file: UploadFile = File(...),
    language: SupportedLanguage = Form(default=SupportedLanguage.en),
    db: AsyncSession = Depends(get_db),
    current_user: UserRecord | None = Depends(get_current_user),
) -> CaptionResponse:
    image_bytes = await validate_upload_file(file)

    cache_key = cache_service.compute_key(image_bytes, language.value)
    cached = cache_service.get(cache_key)

    if cached:
        logger.info("Serving caption from cache")
        return CaptionResponse(**cached)

    image = image_service.process_upload(image_bytes)

    # generate_caption() makes a blocking (synchronous) network call to the
    # Hugging Face API that can take many seconds. Running it directly here
    # would freeze this single worker's event loop for that whole time,
    # meaning even Render's health check couldn't get a response — Render
    # would then think the service is dead and force-restart it mid-request.
    # run_in_threadpool runs it on a separate thread so the event loop stays
    # free to keep answering other requests (like health checks) meanwhile.
    caption_text, confidence, processing_time_ms = await run_in_threadpool(
        blip_service.generate_caption, image
    )

    response = CaptionResponse(
        id=str(uuid4()),
        caption=caption_text,
        confidence=confidence,
        processing_time_ms=processing_time_ms,
        language=language,
        created_at=datetime.utcnow(),
    )

    cache_service.set(cache_key, response.model_dump())

    if current_user is not None:
        thumbnail_data_url = image_service.generate_thumbnail_data_url(image)
        record = CaptionRecord(
            id=response.id,
            user_id=current_user.id,
            caption=response.caption,
            confidence=response.confidence,
            language=language.value,
            thumbnail_url=thumbnail_data_url,
            processing_time_ms=response.processing_time_ms,
            original_filename=file.filename,
            created_at=response.created_at,
        )
        db.add(record)
        current_user.captions_used += 1
        await db.commit()

    return response