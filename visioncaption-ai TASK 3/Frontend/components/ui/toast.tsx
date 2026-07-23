"use client";

import { Toaster as SonnerToaster, type ToasterProps } from "sonner";
import { useTheme } from "next-themes";

export function ToastProvider(props: Partial<ToasterProps>) {
  const { resolvedTheme } = useTheme();

  return (
    <SonnerToaster
      position="top-right"
      richColors
      closeButton
      theme={(resolvedTheme as ToasterProps["theme"]) ?? "system"}
      toastOptions={{
        classNames: {
          toast:
            "rounded-2xl! border! border-border/60! shadow-xl! backdrop-blur-xl! bg-background/95!",
          title: "text-sm! font-medium!",
          description: "text-xs! text-muted-foreground!",
          actionButton: "rounded-full!",
          cancelButton: "rounded-full!",
        },
      }}
      {...props}
    />
  );
}