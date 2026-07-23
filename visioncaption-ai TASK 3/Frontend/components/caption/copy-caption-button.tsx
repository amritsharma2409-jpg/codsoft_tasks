"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { cn, copyToClipboard } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface CopyCaptionButtonProps {
  text: string;
  variant?: "default" | "icon" | "full";
  className?: string;
}

export function CopyCaptionButton({
  text,
  variant = "default",
  className,
}: CopyCaptionButtonProps) {
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  const handleCopy = async () => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      toast.success("Caption copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error("Could not copy to clipboard");
    }
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy caption"
        className={cn(
          "h-9 w-9 rounded-full flex items-center justify-center transition-colors",
          copied
            ? "bg-emerald-500 text-white"
            : "glass-card hover:bg-secondary",
          className
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.span
              key="check"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Check className="h-4 w-4" />
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Copy className="h-4 w-4" />
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "inline-flex items-center justify-center gap-2 text-sm font-medium rounded-full px-4 py-2.5 transition-all",
        copied
          ? "bg-emerald-500 text-white"
          : "bg-foreground text-background hover:opacity-90",
        variant === "full" && "w-full",
        className
      )}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          Copied
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          Copy Caption
        </>
      )}
    </button>
  );
}
