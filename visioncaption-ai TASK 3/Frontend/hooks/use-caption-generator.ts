"use client";

import { useCallback, useState } from "react";
import { ApiError, captionApi } from "@/lib/api";
import type { CaptionResponse, UploadStatus } from "@/lib/types";

interface UseCaptionGeneratorReturn {
  result: CaptionResponse | null;
  status: UploadStatus;
  error: string | null;
  generate: (file: File, language?: string) => Promise<void>;
  reset: () => void;
}

export function useCaptionGenerator(): UseCaptionGeneratorReturn {
  const [result, setResult] = useState<CaptionResponse | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (file: File, language = "en") => {
    setStatus("processing");
    setError(null);

    try {
      const response = await captionApi.generate(file, language);
      setResult(response);
      setStatus("success");
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Failed to generate caption";
      setError(message);
      setStatus("error");
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setStatus("idle");
    setError(null);
  }, []);

  return { result, status, error, generate, reset };
}