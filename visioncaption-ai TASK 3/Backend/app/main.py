from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from app.api.v1.router import api_router
from app.config import settings
from app.core.error_handlers import register_exception_handlers
from app.core.logging_config import configure_logging, get_logger
from app.db.database import init_db
from app.services.blip_service import blip_service
from app.services.object_detection_service import object_detection_service
from app.services.ocr_service import ocr_service

configure_logging()
logger = get_logger(__name__)

limiter = Limiter(key_func=get_remote_address)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"Starting {settings.APP_NAME} in '{settings.APP_ENV}' mode")

    await init_db()
    logger.info("Database initialized")

    blip_service.load_model()

    if settings.ENABLE_OCR:
        ocr_service.load_model()

    if settings.ENABLE_OBJECT_DETECTION:
        object_detection_service.load_model()

    yield

    logger.info("Shutting down and releasing model resources")
    blip_service.unload_model()
    ocr_service.unload_model()
    object_detection_service.unload_model()


app = FastAPI(
    title=settings.APP_NAME,
    description="Production-ready AI image captioning, OCR, and object detection API "
    "powered by free Hugging Face models (BLIP, TrOCR, DETR)",
    version="1.0.0",
    docs_url="/docs" if not settings.is_production else None,
    redoc_url="/redoc" if not settings.is_production else None,
    lifespan=lifespan,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

register_exception_handlers(app)

app.include_router(api_router, prefix=settings.API_V1_PREFIX)


@app.get("/", tags=["Root"])
async def root():
    return {
        "name": settings.APP_NAME,
        "status": "running",
        "docs": "/docs",
        "api_prefix": settings.API_V1_PREFIX,
        "capabilities": ["captioning", "ocr", "object-detection"],
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=not settings.is_production,
    )