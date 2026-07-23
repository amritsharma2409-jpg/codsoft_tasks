from fastapi import HTTPException, status


class VisionCaptionException(HTTPException):
    def __init__(self, status_code: int, detail: str, code: str | None = None):
        super().__init__(status_code=status_code, detail=detail)
        self.code = code


class InvalidImageException(VisionCaptionException):
    def __init__(self, detail: str = "The uploaded file is not a valid image"):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail,
            code="INVALID_IMAGE",
        )


class FileTooLargeException(VisionCaptionException):
    def __init__(self, max_size_mb: int):
        super().__init__(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds the {max_size_mb}MB size limit",
            code="FILE_TOO_LARGE",
        )


class UnsupportedFileTypeException(VisionCaptionException):
    def __init__(self, allowed_types: list[str]):
        super().__init__(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"Only the following formats are supported: {', '.join(allowed_types)}",
            code="UNSUPPORTED_FILE_TYPE",
        )


class ModelNotReadyException(VisionCaptionException):
    def __init__(self, model_name: str = "captioning"):
        super().__init__(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"The {model_name} model is still loading. Please try again shortly.",
            code="MODEL_NOT_READY",
        )


class CaptionGenerationException(VisionCaptionException):
    def __init__(self, detail: str = "Failed to generate caption for this image"):
        super().__init__(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=detail,
            code="CAPTION_GENERATION_FAILED",
        )


class OCRProcessingException(VisionCaptionException):
    def __init__(self, detail: str = "Failed to extract text from this image"):
        super().__init__(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=detail,
            code="OCR_PROCESSING_FAILED",
        )


class ObjectDetectionException(VisionCaptionException):
    def __init__(self, detail: str = "Failed to detect objects in this image"):
        super().__init__(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=detail,
            code="OBJECT_DETECTION_FAILED",
        )


class RateLimitExceededException(VisionCaptionException):
    def __init__(self, detail: str = "You have exceeded your monthly caption limit"):
        super().__init__(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=detail,
            code="RATE_LIMIT_EXCEEDED",
        )


class UnauthorizedException(VisionCaptionException):
    def __init__(self, detail: str = "Invalid authentication credentials"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            code="UNAUTHORIZED",
        )


class InvalidCredentialsException(VisionCaptionException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            code="INVALID_CREDENTIALS",
        )


class UserAlreadyExistsException(VisionCaptionException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists",
            code="USER_ALREADY_EXISTS",
        )


class UploadNotFoundException(VisionCaptionException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The referenced upload could not be found or has expired",
            code="UPLOAD_NOT_FOUND",
        )