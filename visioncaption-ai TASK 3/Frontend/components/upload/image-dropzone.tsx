"use client";

import { useCallback, useRef, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { ImagePlus, UploadCloud, AlertCircle } from "lucide-react";
import { cn, formatBytes } from "@/lib/utils";

const MAX_SIZE_BYTES = 10 * 1024 * 1024;
const ACCEPTED_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
};

interface ImageDropzoneProps {
  onFileAccepted: (file: File) => void;
  disabled?: boolean;
  className?: string;
}

export function ImageDropzone({
  onFileAccepted,
  disabled = false,
  className,
}: ImageDropzoneProps) {
  const [error, setError] = useState<string | null>(null);
  const errorTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showError = useCallback((message: string) => {
    setError(message);
    if (errorTimeout.current) clearTimeout(errorTimeout.current);
    errorTimeout.current = setTimeout(() => setError(null), 4000);
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejections: FileRejection[]) => {
      if (rejections.length > 0) {
        const rejection = rejections[0];
        const code = rejection.errors[0]?.code;
        if (code === "file-too-large") {
          showError(`File exceeds ${formatBytes(MAX_SIZE_BYTES)} limit`);
        } else if (code === "file-invalid-type") {
          showError("Only JPG, PNG, and WEBP files are supported");
        } else {
          showError("This file could not be uploaded");
        }
        return;
      }
      const file = acceptedFiles[0];
      if (file) onFileAccepted(file);
    },
    [onFileAccepted, showError]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: ACCEPTED_TYPES,
      maxSize: MAX_SIZE_BYTES,
      maxFiles: 1,
      multiple: false,
      disabled,
    });

  return (
    <div className={cn("w-full", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer group",
          "flex flex-col items-center justify-center text-center px-6 py-16 sm:py-20",
          "bg-secondary/30 hover:bg-secondary/50",
          isDragActive && !isDragReject && "border-primary-500 bg-primary-500/5 scale-[1.01]",
          isDragReject && "border-destructive bg-destructive/5",
          !isDragActive && "border-border",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none"
        )}
      >
        <input {...getInputProps()} aria-label="Upload image" />

        <motion.div
          animate={{
            scale: isDragActive ? 1.1 : 1,
            rotate: isDragActive ? -6 : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={cn(
            "h-16 w-16 rounded-2xl flex items-center justify-center mb-5 shadow-lg transition-colors",
            isDragActive
              ? "bg-gradient-animated shadow-primary-500/30"
              : "bg-background border border-border group-hover:border-primary-300 shadow-sm"
          )}
        >
          {isDragActive ? (
            <UploadCloud className="h-7 w-7 text-white" />
          ) : (
            <ImagePlus className="h-7 w-7 text-primary-500" />
          )}
        </motion.div>

        <p className="text-base font-medium">
          {isDragActive ? "Drop your image here" : "Drag & drop an image"}
        </p>
        <p className="text-sm text-muted-foreground mt-1.5">
          or{" "}
          <span className="text-primary-500 font-medium">
            click to browse
          </span>{" "}
          from your device
        </p>
        <p className="text-xs text-muted-foreground mt-4">
          JPG, PNG, or WEBP · Max {formatBytes(MAX_SIZE_BYTES)}
        </p>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            className="mt-3 flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-lg px-3.5 py-2.5 overflow-hidden"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
