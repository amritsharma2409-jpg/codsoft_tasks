"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { X, RefreshCw, FileImage } from "lucide-react";
import { cn, formatBytes, truncateFileName } from "@/lib/utils";

interface ImagePreviewProps {
  file: File;
  onRemove: () => void;
  onReplace?: () => void;
  className?: string;
}

export function ImagePreview({
  file,
  onRemove,
  onReplace,
  className,
}: ImagePreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "relative rounded-2xl overflow-hidden glass-card group",
        className
      )}
    >
      <div className="relative aspect-video bg-secondary/50 overflow-hidden">
        {previewUrl && (
          <Image
            src={previewUrl}
            alt="Selected preview"
            fill
            unoptimized
            className="object-contain"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="absolute top-3 right-3 flex items-center gap-2">
          {onReplace && (
            <button
              type="button"
              onClick={onReplace}
              aria-label="Replace image"
              className="h-9 w-9 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 transition-colors opacity-0 group-hover:opacity-100"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onRemove}
            aria-label="Remove image"
            className="h-9 w-9 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-destructive transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 px-4 py-3 border-t border-border/60">
        <div className="h-9 w-9 rounded-lg bg-primary-500/10 flex items-center justify-center shrink-0">
          <FileImage className="h-4 w-4 text-primary-500" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium truncate">
            {truncateFileName(file.name)}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatBytes(file.size)} · {file.type.split("/")[1]?.toUpperCase()}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
