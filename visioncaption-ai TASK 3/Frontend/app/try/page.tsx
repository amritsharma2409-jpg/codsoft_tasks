"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowLeft, RotateCcw, FileText } from "lucide-react";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ImageDropzone } from "@/components/upload/image-dropzone";
import { ImagePreview } from "@/components/upload/image-preview";
import { CaptionLoadingState } from "@/components/caption/caption-loading-state";
import { CaptionResultCard } from "@/components/caption/caption-result-card";
import { OcrResultCard } from "@/components/caption/ocr-result-card";

import { useImageUpload } from "@/hooks/use-image-upload";
import { useCaptionGenerator } from "@/hooks/use-caption-generator";
import { useOcr } from "@/hooks/use-ocr";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type Mode = "caption" | "ocr";

export default function TryPage() {
  const { file, setFile, removeFile } = useImageUpload();
  const captionState = useCaptionGenerator();
  const ocrState = useOcr();
  const [mode, setMode] = useState<Mode>("caption");
  const [language] = useState("en");
  const toast = useToast();

  const { status, error } =
    mode === "caption"
      ? { status: captionState.status, error: captionState.error }
      : { status: ocrState.status, error: ocrState.error };

  const handleFileAccepted = (newFile: File) => {
    const accepted = setFile(newFile);
    if (accepted) {
      captionState.reset();
      ocrState.reset();
    }
  };

  const handleGenerate = async () => {
    if (!file) return;
    if (mode === "caption") {
      await captionState.generate(file, language);
    } else {
      await ocrState.extract(file);
    }
  };

  const handleRemove = () => {
    removeFile();
    captionState.reset();
    ocrState.reset();
  };

  const handleTryAnother = () => {
    removeFile();
    captionState.reset();
    ocrState.reset();
  };

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    captionState.reset();
    ocrState.reset();
  };

  if (error && status === "error") {
    toast.error(error);
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <Navbar />

      <section className="relative pt-36 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to home
          </a>

          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 rounded-full glass-card px-4 py-1.5 text-xs font-medium text-muted-foreground mb-5">
              <Sparkles className="h-3.5 w-3.5 text-primary-500" />
              Free live demo · No sign-up required
            </div>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
              Try VisionCaption AI
            </h1>
            <p className="mt-3 text-muted-foreground">
              Upload an image below and get an AI-generated caption or
              extracted text in seconds.
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 mb-8">
            <button
              type="button"
              onClick={() => handleModeChange("caption")}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors",
                mode === "caption"
                  ? "bg-foreground text-background"
                  : "glass-card text-muted-foreground hover:text-foreground"
              )}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Caption
            </button>
            <button
              type="button"
              onClick={() => handleModeChange("ocr")}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors",
                mode === "ocr"
                  ? "bg-foreground text-background"
                  : "glass-card text-muted-foreground hover:text-foreground"
              )}
            >
              <FileText className="h-3.5 w-3.5" />
              Read Text
            </button>
          </div>

          <AnimatePresence mode="wait">
            {!file && (
              <motion.div
                key="dropzone"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ImageDropzone onFileAccepted={handleFileAccepted} />
              </motion.div>
            )}

            {file && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-5"
              >
                <ImagePreview file={file} onRemove={handleRemove} />

                {status === "idle" && (
                  <button
                    type="button"
                    onClick={handleGenerate}
                    className="w-full inline-flex items-center justify-center gap-2 bg-foreground text-background px-6 py-3.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    {mode === "caption" ? (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Generate Caption
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4" />
                        Extract Text
                      </>
                    )}
                  </button>
                )}

                {status === "processing" && <CaptionLoadingState />}

                {status === "success" &&
                  mode === "caption" &&
                  captionState.result && (
                    <>
                      <CaptionResultCard
                        result={{
                          caption: captionState.result.caption,
                          confidence: captionState.result.confidence,
                          processingTimeMs: captionState.result.processingTimeMs,
                          language: captionState.result.language,
                        }}
                        onRegenerate={handleGenerate}
                      />
                      <button
                        type="button"
                        onClick={handleTryAnother}
                        className="w-full inline-flex items-center justify-center gap-2 glass-card px-6 py-3 rounded-full text-sm font-medium hover:bg-secondary/50 transition-colors"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Try another image
                      </button>
                    </>
                  )}

                {status === "success" && mode === "ocr" && ocrState.result && (
                  <>
                    <OcrResultCard
                      result={ocrState.result}
                      onRegenerate={handleGenerate}
                    />
                    <button
                      type="button"
                      onClick={handleTryAnother}
                      className="w-full inline-flex items-center justify-center gap-2 glass-card px-6 py-3 rounded-full text-sm font-medium hover:bg-secondary/50 transition-colors"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Try another image
                    </button>
                  </>
                )}

                {status === "error" && (
                  <div className="rounded-2xl glass-card p-6 text-center space-y-4">
                    <p className="text-sm text-destructive">
                      {error ?? "Something went wrong. Please try again."}
                    </p>
                    <button
                      type="button"
                      onClick={handleGenerate}
                      className="inline-flex items-center justify-center gap-2 bg-foreground text-background px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      Retry
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </main>
  );
}
