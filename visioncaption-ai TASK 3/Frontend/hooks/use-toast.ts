"use client";

import { toast as sonnerToast } from "sonner";

interface ToastOptions {
  description?: string;
  duration?: number;
}

export function useToast() {
  const success = (message: string, options?: ToastOptions) => {
    sonnerToast.success(message, options);
  };

  const error = (message: string, options?: ToastOptions) => {
    sonnerToast.error(message, options);
  };

  const info = (message: string, options?: ToastOptions) => {
    sonnerToast.info(message, options);
  };

  const warning = (message: string, options?: ToastOptions) => {
    sonnerToast.warning(message, options);
  };

  const promise = <T,>(
    promiseFn: Promise<T>,
    messages: { loading: string; success: string; error: string }
  ) => {
    return sonnerToast.promise(promiseFn, messages);
  };

  const dismiss = (id?: string | number) => {
    sonnerToast.dismiss(id);
  };

  return { success, error, info, warning, promise, dismiss };
}