import hashlib
import time
from typing import Optional

from app.core.logging_config import get_logger

logger = get_logger(__name__)


class InMemoryCacheService:
    """Simple TTL in-memory cache for repeated image caption lookups."""

    def __init__(self, ttl_seconds: int = 3600, max_entries: int = 500) -> None:
        self._store: dict[str, tuple[float, dict]] = {}
        self.ttl_seconds = ttl_seconds
        self.max_entries = max_entries

    @staticmethod
    def compute_key(image_bytes: bytes, language: str) -> str:
        hasher = hashlib.sha256()
        hasher.update(image_bytes)
        hasher.update(language.encode("utf-8"))
        return hasher.hexdigest()

    def get(self, key: str) -> Optional[dict]:
        entry = self._store.get(key)
        if entry is None:
            return None

        timestamp, value = entry
        if time.time() - timestamp > self.ttl_seconds:
            del self._store[key]
            return None

        return value

    def set(self, key: str, value: dict) -> None:
        if len(self._store) >= self.max_entries:
            oldest_key = min(self._store, key=lambda k: self._store[k][0])
            del self._store[oldest_key]

        self._store[key] = (time.time(), value)

    def clear(self) -> None:
        self._store.clear()

    def size(self) -> int:
        return len(self._store)


cache_service = InMemoryCacheService()