"use client";

import { motion } from "framer-motion";
import { FileText, RotateCcw, Zap } from "lucide-react";
import { cn, copyToClipboard } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { OcrResponse } from "@/lib/types";

interface OcrResultCardProps {
  result: OcrResponse;
  onRegenerate?: () => void;
  className?: string;
}

export function OcrResultCard({
  result,
  onRegenerate,
  className,
}: OcrResultCardProps) {
  const toast = useToast();

  const handleCopy = async () => {
    const success = await copyToClipboard(result.extractedText);
    if (success) {
      toast.success("Text copied to clipboard");
    } else {
      toast.error("Could not copy to clipboard");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "rounded-2xl glass-card p-6 sm:p-7 relative overflow-hidden",
        className
      )}
    >
      <div className="absolute -top-16 -right-16 h-40 w-40 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between mb-4 relative">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-animated flex items-center justify-center shrink-0">
            <FileText className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-medium">Extracted Text</span>
        </div>

        {result.processingTimeMs && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary rounded-full px-2.5 py-1">
            <Zap className="h-3 w-3 text-primary-500" />
            {(result.processingTimeMs / 1000).toFixed(1)}s
          </div>
        )}
      </div>

      {result.hasText ? (
        <p className="text-base leading-relaxed whitespace-pre-wrap relative">
          {result.extractedText}
        </p>
      ) : (
        <p className="text-sm text-muted-foreground relative">
          No readable text was found in this image.
        </p>
      )}

      <div className="flex items-center gap-4 mt-5 text-xs text-muted-foreground relative">
        <span>{result.characterCount} characters</span>
        <span>{result.wordCount} words</span>
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-6 relative">
        <button
          type="button"
          onClick={handleCopy}
          disabled={!result.hasText}
          className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 text-sm font-medium rounded-full px-4 py-2.5 bg-foreground text-background hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Copy Text
        </button>

        {onRegenerate && (
          <button
            type="button"
            onClick={onRegenerate}
            aria-label="Re-extract text"
            className="h-10 w-10 rounded-full glass-card flex items-center justify-center hover:bg-secondary transition-colors shrink-0"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
