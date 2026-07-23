import time
from threading import Lock
from typing import Optional

import torch
from PIL import Image
from transformers import DetrForObjectDetection, DetrImageProcessor

from app.config import settings
from app.core.exceptions import ModelNotReadyException, ObjectDetectionException
from app.core.logging_config import get_logger
from app.models.schemas import BoundingBox, DetectedObject

logger = get_logger(__name__)


class ObjectDetectionService:
    """Singleton wrapper around Facebook's DETR (DEtection TRansformer) model."""

    _instance: Optional["ObjectDetectionService"] = None
    _lock = Lock()

    def __new__(cls) -> "ObjectDetectionService":
        with cls._lock:
            if cls._instance is None:
                cls._instance = super().__new__(cls)
                cls._instance._initialized = False
        return cls._instance

    def __init__(self) -> None:
        if self._initialized:
            return
        self.processor: Optional[DetrImageProcessor] = None
        self.model: Optional[DetrForObjectDetection] = None
        self.device = torch.device(settings.MODEL_DEVICE)
        self.is_ready = False
        self._initialized = True

    def load_model(self) -> None:
        if not settings.ENABLE_OBJECT_DETECTION:
            logger.info("Object detection is disabled via settings; skipping model load")
            return

        if self.is_ready:
            return

        logger.info(
            f"Loading object detection model '{settings.DETECTION_MODEL_NAME}' "
            f"on device '{self.device}'..."
        )
        start = time.time()

        self.processor = DetrImageProcessor.from_pretrained(
            settings.DETECTION_MODEL_NAME,
            cache_dir=settings.MODEL_CACHE_DIR,
        )
        self.model = DetrForObjectDetection.from_pretrained(
            settings.DETECTION_MODEL_NAME,
            cache_dir=settings.MODEL_CACHE_DIR,
        ).to(self.device)
        self.model.eval()

        elapsed = time.time() - start
        self.is_ready = True
        logger.info(f"Object detection model loaded successfully in {elapsed:.2f}s")

    def unload_model(self) -> None:
        self.model = None
        self.processor = None
        self.is_ready = False
        if torch.cuda.is_available():
            torch.cuda.empty_cache()

    @torch.inference_mode()
    def detect_objects(self, image: Image.Image) -> tuple[list[DetectedObject], int]:
        if not settings.ENABLE_OBJECT_DETECTION:
            raise ObjectDetectionException("Object detection is currently disabled on this deployment")

        if not self.is_ready or self.model is None or self.processor is None:
            raise ModelNotReadyException("object detection")

        start_time = time.time()

        try:
            inputs = self.processor(images=image, return_tensors="pt").to(self.device)
            outputs = self.model(**inputs)

            target_sizes = torch.tensor([image.size[::-1]])
            results = self.processor.post_process_object_detection(
                outputs,
                target_sizes=target_sizes,
                threshold=settings.DETECTION_CONFIDENCE_THRESHOLD,
            )[0]

            detected_objects: list[DetectedObject] = []
            for score, label_id, box in zip(
                results["scores"], results["labels"], results["boxes"]
            ):
                x_min, y_min, x_max, y_max = box.tolist()
                detected_objects.append(
                    DetectedObject(
                        label=self.model.config.id2label[label_id.item()],
                        confidence=round(score.item(), 4),
                        bounding_box=BoundingBox(
                            x_min=round(x_min, 2),
                            y_min=round(y_min, 2),
                            x_max=round(x_max, 2),
                            y_max=round(y_max, 2),
                        ),
                    )
                )

            detected_objects.sort(key=lambda obj: obj.confidence, reverse=True)
            detected_objects = detected_objects[: settings.MAX_DETECTED_OBJECTS]

        except Exception as exc:
            logger.error(f"Object detection failed: {exc}")
            raise ObjectDetectionException(str(exc))

        processing_time_ms = int((time.time() - start_time) * 1000)
        return detected_objects, processing_time_ms


object_detection_service = ObjectDetectionService()