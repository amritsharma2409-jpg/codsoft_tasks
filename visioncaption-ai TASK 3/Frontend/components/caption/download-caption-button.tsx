"use client";

import { useState } from "react";
import { Download, FileText, Image as ImageIcon, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface DownloadCaptionButtonProps {
  caption: string;
  filename?: string;
  className?: string;
}

type DownloadFormat = "txt" | "json" | "srt";

function downloadBlob(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function DownloadCaptionButton({
  caption,
  filename = "caption",
  className,
}: DownloadCaptionButtonProps) {
  const [open, setOpen] = useState(false);
  const toast = useToast();

  const handleDownload = (format: DownloadFormat) => {
    switch (format) {
      case "txt":
        downloadBlob(caption, `${filename}.txt`, "text/plain");
        break;
      case "json":
        downloadBlob(
          JSON.stringify({ caption, generatedAt: new Date().toISOString() }, null, 2),
          `${filename}.json`,
          "application/json"
        );
        break;
      case "srt":
        downloadBlob(
          `1\n00:00:00,000 --> 00:00:05,000\n${caption}\n`,
          `${filename}.srt`,
          "application/x-subrip"
        );
        break;
    }
    toast.success(`Downloaded as .${format}`);
    setOpen(false);
  };

  const options: { format: DownloadFormat; label: string; icon: typeof FileText }[] = [
    { format: "txt", label: "Plain text (.txt)", icon: FileText },
    { format: "json", label: "JSON (.json)", icon: FileText },
    { format: "srt", label: "Subtitle (.srt)", icon: ImageIcon },
  ];

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center justify-center gap-2 text-sm font-medium rounded-full px-4 py-2.5 glass-card hover:bg-secondary transition-colors"
      >
        <Download className="h-4 w-4" />
        Download
        <ChevronDown
          className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full mt-2 left-0 z-20 w-48 rounded-xl glass-card p-1.5 shadow-xl"
            >
              {options.map((opt) => (
                <button
                  key={opt.format}
                  type="button"
                  onClick={() => handleDownload(opt.format)}
                  className="w-full flex items-center gap-2.5 text-sm px-3 py-2.5 rounded-lg hover:bg-secondary transition-colors text-left"
                >
                  <opt.icon className="h-4 w-4 text-muted-foreground" />
                  {opt.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
