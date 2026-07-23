from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.core.exceptions import VisionCaptionException
from app.core.logging_config import get_logger

logger = get_logger(__name__)


def _error_body(detail: str, status_code: int, code: str | None = None) -> dict:
    return {
        "detail": detail,
        "code": code,
        "status_code": status_code,
    }


def register_exception_handlers(app: FastAPI) -> None:
    """Attach all global exception handlers to the FastAPI app instance."""

    @app.exception_handler(VisionCaptionException)
    async def vision_caption_exception_handler(
        request: Request, exc: VisionCaptionException
    ) -> JSONResponse:
        logger.warning(
            f"[{getattr(exc, 'code', 'APP_ERROR')}] {exc.detail} | path={request.url.path}"
        )
        return JSONResponse(
            status_code=exc.status_code,
            content=_error_body(exc.detail, exc.status_code, getattr(exc, "code", None)),
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        request: Request, exc: RequestValidationError
    ) -> JSONResponse:
        errors = exc.errors()
        first_error = errors[0] if errors else {}
        field = ".".join(str(loc) for loc in first_error.get("loc", []) if loc != "body")
        message = first_error.get("msg", "Invalid request payload")
        detail = f"{field}: {message}" if field else message

        logger.warning(f"[VALIDATION_ERROR] {detail} | path={request.url.path}")

        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content=_error_body(detail, status.HTTP_422_UNPROCESSABLE_ENTITY, "VALIDATION_ERROR"),
        )

    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(
        request: Request, exc: StarletteHTTPException
    ) -> JSONResponse:
        logger.warning(f"[HTTP_ERROR] {exc.detail} | path={request.url.path}")
        return JSONResponse(
            status_code=exc.status_code,
            content=_error_body(str(exc.detail), exc.status_code, "HTTP_ERROR"),
        )

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
        logger.error(
            f"[UNHANDLED_EXCEPTION] {exc} | path={request.url.path}", exc_info=True
        )
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content=_error_body(
                "An unexpected error occurred. Our team has been notified.",
                status.HTTP_500_INTERNAL_SERVER_ERROR,
                "INTERNAL_SERVER_ERROR",
            ),
        )