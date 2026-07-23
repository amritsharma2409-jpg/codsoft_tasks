import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL, API_ROUTES, LOCAL_STORAGE_KEYS } from "./constants";
import type {
  ApiErrorResponse,
  AuthTokens,
  CaptionHistoryResponse,
  CaptionResponse,
  LoginPayload,
  OcrResponse,
  RegisterPayload,
  User,
} from "./types";

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(LOCAL_STORAGE_KEYS.accessToken);
}

function setTokens(tokens: AuthTokens): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOCAL_STORAGE_KEYS.accessToken, tokens.accessToken);
  window.localStorage.setItem(LOCAL_STORAGE_KEYS.refreshToken, tokens.refreshToken);
}

function clearTokens(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(LOCAL_STORAGE_KEYS.accessToken);
  window.localStorage.removeItem(LOCAL_STORAGE_KEYS.refreshToken);
}

const client: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
});

client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    if (config.headers) {
      delete config.headers["Content-Type"];
    }
  } else if (config.headers && !config.headers["Content-Type"]) {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    if (error.response?.status === 401) {
      clearTokens();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export class ApiError extends Error {
  statusCode: number;
  code?: string;

  constructor(message: string, statusCode: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;
  }
}

function handleError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const message =
      axiosError.response?.data?.detail ?? axiosError.message ?? "Something went wrong";
    const statusCode = axiosError.response?.status ?? 500;
    const code = axiosError.response?.data?.code;
    throw new ApiError(message, statusCode, code);
  }
  throw new ApiError("An unexpected error occurred", 500);
}

export const captionApi = {
  async generate(file: File, language = "en"): Promise<CaptionResponse> {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("language", language);

      const { data } = await client.post<CaptionResponse>(
        API_ROUTES.caption,
        formData
      );
      return data;
    } catch (error) {
      handleError(error);
    }
  },

  async getHistory(page = 1, pageSize = 20): Promise<CaptionHistoryResponse> {
    try {
      const { data } = await client.get<CaptionHistoryResponse>(
        API_ROUTES.history,
        { params: { page, page_size: pageSize } }
      );
      return data;
    } catch (error) {
      handleError(error);
    }
  },

  async deleteHistoryItem(id: string): Promise<void> {
    try {
      await client.delete(`${API_ROUTES.history}/${id}`);
    } catch (error) {
      handleError(error);
    }
  },

  async checkHealth(): Promise<{ status: string }> {
    try {
      const { data } = await client.get<{ status: string }>(API_ROUTES.health);
      return data;
    } catch (error) {
      handleError(error);
    }
  },
};

export const ocrApi = {
  async extractText(file: File): Promise<OcrResponse> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const { data } = await client.post<OcrResponse>(
        API_ROUTES.ocr,
        formData
      );
      return data;
    } catch (error) {
      handleError(error);
    }
  },
};

export const authApi = {
  async login(payload: LoginPayload): Promise<{ user: User; tokens: AuthTokens }> {
    try {
      const { data } = await client.post<{ user: User; tokens: AuthTokens }>(
        API_ROUTES.login,
        payload
      );
      setTokens(data.tokens);
      return data;
    } catch (error) {
      handleError(error);
    }
  },

  async register(payload: RegisterPayload): Promise<{ user: User; tokens: AuthTokens }> {
    try {
      const { data } = await client.post<{ user: User; tokens: AuthTokens }>(
        API_ROUTES.register,
        payload
      );
      setTokens(data.tokens);
      return data;
    } catch (error) {
      handleError(error);
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      const { data } = await client.get<User>(API_ROUTES.me);
      return data;
    } catch (error) {
      handleError(error);
    }
  },

  logout(): void {
    clearTokens();
  },
};

export default client;