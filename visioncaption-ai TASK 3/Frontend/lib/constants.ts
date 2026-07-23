import type { SupportedLanguage } from "./types";

export const APP_NAME = "VisionCaption AI";
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://visioncaption.ai";
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const API_ROUTES = {
  caption: "/api/v1/caption",
  captionBatch: "/api/v1/caption/batch",
  ocr: "/api/v1/ocr",
  history: "/api/v1/history",
  health: "/api/v1/health",
  login: "/api/v1/auth/login",
  register: "/api/v1/auth/register",
  refresh: "/api/v1/auth/refresh",
  me: "/api/v1/auth/me",
} as const;

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const ACCEPTED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

export const FREE_PLAN_MONTHLY_LIMIT = 50;
export const PRO_PLAN_MONTHLY_LIMIT = 2000;

export const SUPPORTED_LANGUAGES: { code: SupportedLanguage; label: string }[] = [
  { code: "en", label: "English" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "it", label: "Italian" },
  { code: "pt", label: "Portuguese" },
  { code: "hi", label: "Hindi" },
  { code: "ja", label: "Japanese" },
  { code: "ko", label: "Korean" },
  { code: "zh", label: "Chinese" },
];

export const TOAST_DURATION_MS = 4000;

export const LOCAL_STORAGE_KEYS = {
  accessToken: "vc_access_token",
  refreshToken: "vc_refresh_token",
  theme: "vc_theme",
} as const;

export const PRICING_PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "/forever",
    desc: "For individuals exploring AI captioning.",
    features: [
      "50 captions per month",
      "Standard BLIP model",
      "JPG, PNG, WEBP support",
      "Community support",
    ],
    cta: "Start Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    desc: "For creators and small teams shipping content.",
    features: [
      "2,000 captions per month",
      "Priority inference queue",
      "Batch upload up to 50 images",
      "Multilingual captions",
      "Email support",
    ],
    cta: "Start Pro Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For platforms with high-volume needs.",
    features: [
      "Unlimited captions",
      "Dedicated GPU inference",
      "Custom model fine-tuning",
      "SLA & priority support",
      "SSO & audit logs",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
] as const;

export const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
] as const;