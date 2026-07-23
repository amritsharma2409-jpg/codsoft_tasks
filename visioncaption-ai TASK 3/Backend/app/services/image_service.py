from PIL import Image

from app.core.logging_config import get_logger
from app.utils.file_helper import bytes_to_pil_image, create_thumbnail, pil_image_to_base64
from app.utils.image_validator import is_image_dimension_valid
from app.core.exceptions import InvalidImageException

logger = get_logger(__name__)


class ImageService:
    def process_upload(self, image_bytes: bytes) -> Image.Image:
        image = bytes_to_pil_image(image_bytes)

        width, height = image.size
        if not is_image_dimension_valid(width, height):
            raise InvalidImageException(
                f"Image dimensions {width}x{height} are outside the allowed range"
            )

        return image

    def generate_thumbnail_data_url(self, image: Image.Image) -> str:
        thumbnail = create_thumbnail(image)
        return pil_image_to_base64(thumbnail)

    def get_image_metadata(self, image: Image.Image) -> dict:
        return {
            "width": image.width,
            "height": image.height,
            "mode": image.mode,
            "format": image.format,
        }


image_service = ImageService()