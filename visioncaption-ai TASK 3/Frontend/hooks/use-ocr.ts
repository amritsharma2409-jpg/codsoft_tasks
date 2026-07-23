"use client";

import { useCallback, useState } from "react";
import { ApiError, ocrApi } from "@/lib/api";
import type { OcrResponse, UploadStatus } from "@/lib/types";

interface UseOcrReturn {
  result: OcrResponse | null;
  status: UploadStatus;
  error: string | null;
  extract: (file: File) => Promise<void>;
  reset: () => void;
}

export function useOcr(): UseOcrReturn {
  const [result, setResult] = useState<OcrResponse | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const extract = useCallback(async (file: File) => {
    setStatus("processing");
    setError(null);

    try {
      const response = await ocrApi.extractText(file);
      setResult(response);
      setStatus("success");
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Failed to extract text";
      setError(message);
      setStatus("error");
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setStatus("idle");
    setError(null);
  }, []);

  return { result, status, error, extract, reset };
}