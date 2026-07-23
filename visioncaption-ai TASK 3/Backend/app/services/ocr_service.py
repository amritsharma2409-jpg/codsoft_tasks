import time
from threading import Lock
from typing import Optional

import torch
from PIL import Image
from transformers import TrOCRProcessor, VisionEncoderDecoderModel

from app.config import settings
from app.core.exceptions import ModelNotReadyException, OCRProcessingException
from app.core.logging_config import get_logger

logger = get_logger(__name__)


class OCRService:
    """Singleton wrapper around Microsoft's TrOCR text recognition model."""

    _instance: Optional["OCRService"] = None
    _lock = Lock()

    def __new__(cls) -> "OCRService":
        with cls._lock:
            if cls._instance is None:
                cls._instance = super().__new__(cls)
                cls._instance._initialized = False
        return cls._instance

    def __init__(self) -> None:
        if self._initialized:
            return
        self.processor: Optional[TrOCRProcessor] = None
        self.model: Optional[VisionEncoderDecoderModel] = None
        self.device = torch.device(settings.MODEL_DEVICE)
        self.is_ready = False
        self._initialized = True

    def load_model(self) -> None:
        if not settings.ENABLE_OCR:
            logger.info("OCR is disabled via settings; skipping model load")
            return

        if self.is_ready:
            return

        logger.info(f"Loading OCR model '{settings.OCR_MODEL_NAME}' on device '{self.device}'...")
        start = time.time()

        self.processor = TrOCRProcessor.from_pretrained(
            settings.OCR_MODEL_NAME,
            cache_dir=settings.MODEL_CACHE_DIR,
        )
        self.model = VisionEncoderDecoderModel.from_pretrained(
            settings.OCR_MODEL_NAME,
            cache_dir=settings.MODEL_CACHE_DIR,
        ).to(self.device)
        self.model.eval()

        elapsed = time.time() - start
        self.is_ready = True
        logger.info(f"OCR model loaded successfully in {elapsed:.2f}s")

    def unload_model(self) -> None:
        self.model = None
        self.processor = None
        self.is_ready = False
        if torch.cuda.is_available():
            torch.cuda.empty_cache()

    @torch.inference_mode()
    def extract_text(self, image: Image.Image) -> tuple[str, int]:
        if not settings.ENABLE_OCR:
            raise OCRProcessingException("OCR is currently disabled on this deployment")

        if not self.is_ready or self.model is None or self.processor is None:
            raise ModelNotReadyException("OCR")

        start_time = time.time()

        try:
            pixel_values = self.processor(images=image, return_tensors="pt").pixel_values.to(
                self.device
            )

            generated_ids = self.model.generate(
                pixel_values,
                max_length=settings.OCR_MAX_LENGTH,
            )

            extracted_text = self.processor.batch_decode(
                generated_ids, skip_special_tokens=True
            )[0].strip()

        except Exception as exc:
            logger.error(f"OCR extraction failed: {exc}")
            raise OCRProcessingException(str(exc))

        processing_time_ms = int((time.time() - start_time) * 1000)
        return extracted_text, processing_time_ms


ocr_service = OCRService()