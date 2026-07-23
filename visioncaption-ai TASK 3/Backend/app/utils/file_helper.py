import base64
import io
import uuid
from pathlib import Path

from PIL import Image


def generate_unique_filename(extension: str = "jpg") -> str:
    return f"{uuid.uuid4().hex}.{extension.lstrip('.')}"


def bytes_to_pil_image(image_bytes: bytes) -> Image.Image:
    image = Image.open(io.BytesIO(image_bytes))
    if image.mode != "RGB":
        image = image.convert("RGB")
    return image


def pil_image_to_base64(image: Image.Image, format: str = "JPEG") -> str:
    buffer = io.BytesIO()
    image.save(buffer, format=format)
    encoded = base64.b64encode(buffer.getvalue()).decode("utf-8")
    return f"data:image/{format.lower()};base64,{encoded}"


def create_thumbnail(image: Image.Image, size: tuple[int, int] = (256, 256)) -> Image.Image:
    thumbnail = image.copy()
    thumbnail.thumbnail(size, Image.Resampling.LANCZOS)
    return thumbnail


def ensure_directory(path: str) -> Path:
    directory = Path(path)
    directory.mkdir(parents=True, exist_ok=True)
    return directory