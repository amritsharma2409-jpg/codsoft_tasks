export interface CaptionRequest {
  imageBase64?: string;
  language?: string;
  maxLength?: number;
}

export interface CaptionResponse {
  id: string;
  caption: string;
  confidence: number;
  processingTimeMs: number;
  language: string;
  createdAt: string;
}

export interface OcrResponse {
  id: string;
  extractedText: string;
  characterCount: number;
  wordCount: number;
  processingTimeMs: number;
  hasText: boolean;
  createdAt: string;
}

export interface CaptionHistoryItem {
  id: string;
  caption: string;
  thumbnailUrl: string;
  confidence: number;
  language: string;
  createdAt: string;
}

export interface CaptionHistoryResponse {
  items: CaptionHistoryItem[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface ApiErrorResponse {
  detail: string;
  code?: string;
  statusCode: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  plan: "free" | "pro" | "enterprise";
  captionsUsed: number;
  captionsLimit: number;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export type UploadStatus = "idle" | "uploading" | "processing" | "success" | "error";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
}

export type SupportedLanguage =
  | "en"
  | "es"
  | "fr"
  | "de"
  | "it"
  | "pt"
  | "hi"
  | "ja"
  | "ko"
  | "zh";

export interface PlanFeature {
  name: string;
  price: string;
  period: string;
  desc: string;
  features: string[];
  cta: string;
  highlighted: boolean;
}