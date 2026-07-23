"use client";

import { motion } from "framer-motion";
import { ScanEye } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/spinner";

interface CaptionLoadingStateProps {
  label?: string;
  variant?: "full" | "compact" | "skeleton";
  className?: string;
}

const STEPS = [
  "Analyzing pixels",
  "Detecting objects",
  "Understanding context",
  "Composing caption",
];

export function CaptionLoadingState({
  label = "Generating caption",
  variant = "full",
  className,
}: CaptionLoadingStateProps) {
  if (variant === "skeleton") {
    return (
      <div className={cn("rounded-2xl glass-card p-6 space-y-3", className)}>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-10 flex-1 rounded-full" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "flex items-center gap-3 rounded-xl glass-card px-4 py-3",
          className
        )}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="h-8 w-8 rounded-lg bg-gradient-animated flex items-center justify-center shrink-0"
        >
          <ScanEye className="h-4 w-4 text-white" />
        </motion.div>
        <span className="text-sm text-muted-foreground">{label}...</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-2xl glass-card p-8 flex flex-col items-center text-center",
        className
      )}
    >
      <div className="relative h-16 w-16 mb-6">
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-animated opacity-30 blur-lg"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="relative h-16 w-16 rounded-2xl bg-gradient-animated flex items-center justify-center shadow-xl shadow-primary-500/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <ScanEye className="h-7 w-7 text-white" />
        </motion.div>
      </div>

      <p className="text-sm font-medium mb-1">{label}</p>
      <p className="text-xs text-muted-foreground mb-6">
        This usually takes 1–3 seconds
      </p>

      <div className="flex items-center gap-1.5 mb-6">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-2 w-2 rounded-full bg-primary-500"
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1, 0.85] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-xs space-y-2.5">
        {STEPS.map((step, i) => (
          <motion.div
            key={step}
            initial={{ opacity: 0.25 }}
            animate={{ opacity: [0.25, 1, 0.25] }}
            transition={{
              duration: 3.2,
              repeat: Infinity,
              delay: i * 0.6,
              ease: "easeInOut",
            }}
            className="flex items-center gap-2.5 text-xs text-muted-foreground"
          >
            <span className="h-1 w-1 rounded-full bg-primary-500 shrink-0" />
            {step}
          </motion.div>
        ))}
      </div>

      <div className="w-full h-1 rounded-full bg-secondary overflow-hidden mt-6">
        <motion.div
          className="h-full bg-gradient-animated rounded-full"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: "40%" }}
        />
      </div>
    </div>
  );
}
