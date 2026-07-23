import io

from PIL import Image, UnidentifiedImageError
from fastapi import UploadFile

from app.config import settings
from app.core.exceptions import (
    FileTooLargeException,
    InvalidImageException,
    UnsupportedFileTypeException,
)


async def validate_upload_file(file: UploadFile) -> bytes:
    if file.content_type not in settings.ALLOWED_IMAGE_TYPES:
        raise UnsupportedFileTypeException(settings.ALLOWED_IMAGE_TYPES)

    contents = await file.read()
    await file.seek(0)

    if len(contents) > settings.max_upload_size_bytes:
        raise FileTooLargeException(settings.MAX_UPLOAD_SIZE_MB)

    if len(contents) == 0:
        raise InvalidImageException("The uploaded file is empty")

    try:
        # NOTE: Image.verify() is overly strict and can reject perfectly
        # valid JPEGs (e.g. ones with certain EXIF/metadata segments from
        # phone cameras). Actually opening + loading pixel data is a more
        # reliable validity check and matches what the rest of the app
        # will do with the image anyway.
        image = Image.open(io.BytesIO(contents))
        image.load()
    except (UnidentifiedImageError, OSError, SyntaxError, ValueError):
        raise InvalidImageException("The file could not be read as a valid image")

    return contents


def is_image_dimension_valid(
    width: int, height: int, min_dim: int = 10, max_dim: int = 10000
) -> bool:
    return min_dim <= width <= max_dim and min_dim <= height <= max_dim