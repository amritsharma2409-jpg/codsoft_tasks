"use client";

import { useCallback, useState } from "react";
import { validateImageFile } from "@/lib/validators";

interface UseImageUploadReturn {
  file: File | null;
  previewUrl: string | null;
  error: string | null;
  setFile: (file: File) => boolean;
  removeFile: () => void;
}

export function useImageUpload(): UseImageUploadReturn {
  const [file, setFileState] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const setFile = useCallback(
    (newFile: File): boolean => {
      const validation = validateImageFile(newFile);
      if (!validation.valid) {
        setError(validation.error ?? "Invalid file");
        return false;
      }

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      const url = URL.createObjectURL(newFile);
      setFileState(newFile);
      setPreviewUrl(url);
      setError(null);
      return true;
    },
    [previewUrl]
  );

  const removeFile = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFileState(null);
    setPreviewUrl(null);
    setError(null);
  }, [previewUrl]);

  return { file, previewUrl, error, setFile, removeFile };
}