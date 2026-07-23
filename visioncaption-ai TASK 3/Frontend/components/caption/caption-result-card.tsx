"use client";

import { motion } from "framer-motion";
import { RotateCcw, Sparkles, Volume2, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { CopyCaptionButton } from "./copy-caption-button";

interface DownloadCaptionButtonProps {
  caption: string;
  className?: string;
}

function DownloadCaptionButton({ caption, className }: DownloadCaptionButtonProps) {
  const handleDownload = () => {
    const blob = new Blob([caption], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = "caption.txt";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      className={cn(
        "flex-1 min-w-[140px] h-10 rounded-full glass-card flex items-center justify-center hover:bg-secondary transition-colors",
        className
      )}
    >
      Download
    </button>
  );
}

export interface CaptionResult {
  caption: string;
  confidence?: number;
  processingTimeMs?: number;
  language?: string;
}

interface CaptionResultCardProps {
  result: CaptionResult;
  onRegenerate?: () => void;
  className?: string;
}

export function CaptionResultCard({
  result,
  onRegenerate,
  className,
}: CaptionResultCardProps) {
  const handleSpeak = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(result.caption);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const confidencePercent = result.confidence
    ? Math.round(result.confidence * 100)
    : null;

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
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-medium">Generated Caption</span>
        </div>

        {result.processingTimeMs && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary rounded-full px-2.5 py-1">
            <Zap className="h-3 w-3 text-primary-500" />
            {(result.processingTimeMs / 1000).toFixed(1)}s
          </div>
        )}
      </div>

      <p className="text-lg sm:text-xl leading-relaxed font-medium relative">
        "{result.caption}"
      </p>

      {confidencePercent !== null && (
        <div className="mt-5 relative">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
            <span>Confidence</span>
            <span className="font-medium text-foreground">
              {confidencePercent}%
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${confidencePercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="h-full bg-gradient-animated rounded-full"
            />
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 mt-6 relative">
        <CopyCaptionButton text={result.caption} className="flex-1 min-w-[140px]" />
        <DownloadCaptionButton caption={result.caption} />

        <button
          type="button"
          onClick={handleSpeak}
          aria-label="Listen to caption"
          className="h-10 w-10 rounded-full glass-card flex items-center justify-center hover:bg-secondary transition-colors shrink-0"
        >
          <Volume2 className="h-4 w-4" />
        </button>

        {onRegenerate && (
          <button
            type="button"
            onClick={onRegenerate}
            aria-label="Regenerate caption"
            className="h-10 w-10 rounded-full glass-card flex items-center justify-center hover:bg-secondary transition-colors shrink-0"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
