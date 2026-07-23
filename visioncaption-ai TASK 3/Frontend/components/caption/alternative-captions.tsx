"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy, Sparkles } from "lucide-react";
import { cn, copyToClipboard } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { staggerContainer, fadeUp } from "@/styles/animations";

export interface AlternativeCaption {
  id: string;
  text: string;
  tone: "descriptive" | "concise" | "creative" | "seo";
}

interface AlternativeCaptionsProps {
  alternatives: AlternativeCaption[];
  onSelect?: (alt: AlternativeCaption) => void;
  className?: string;
}

const TONE_LABELS: Record<AlternativeCaption["tone"], string> = {
  descriptive: "Descriptive",
  concise: "Concise",
  creative: "Creative",
  seo: "SEO Optimized",
};

const TONE_COLORS: Record<AlternativeCaption["tone"], string> = {
  descriptive: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  concise: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  creative: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  seo: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
};

export function AlternativeCaptions({
  alternatives,
  onSelect,
  className,
}: AlternativeCaptionsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const toast = useToast();

  if (alternatives.length === 0) return null;

  const handleCopy = async (alt: AlternativeCaption) => {
    const success = await copyToClipboard(alt.text);
    if (success) {
      setCopiedId(alt.id);
      toast.success("Caption copied");
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2 px-1">
        <Sparkles className="h-3.5 w-3.5 text-primary-500" />
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Alternative Captions
        </h3>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="space-y-2"
      >
        {alternatives.map((alt, i) => (
          <motion.div
            key={alt.id}
            variants={fadeUp}
            custom={i}
            className="group rounded-xl glass-card p-4 hover:bg-secondary/40 transition-colors cursor-pointer"
            onClick={() => onSelect?.(alt)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <span
                  className={cn(
                    "inline-block text-[10px] font-medium px-2 py-0.5 rounded-full mb-2",
                    TONE_COLORS[alt.tone]
                  )}
                >
                  {TONE_LABELS[alt.tone]}
                </span>
                <p className="text-sm leading-relaxed">{alt.text}</p>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy(alt);
                }}
                aria-label="Copy alternative caption"
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center shrink-0 transition-colors opacity-0 group-hover:opacity-100",
                  copiedId === alt.id
                    ? "bg-emerald-500 text-white opacity-100"
                    : "bg-background hover:bg-secondary border border-border"
                )}
              >
                {copiedId === alt.id ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
