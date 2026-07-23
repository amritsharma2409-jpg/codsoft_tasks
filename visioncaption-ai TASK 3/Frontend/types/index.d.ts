export {};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }

  namespace NodeJS {
    interface ProcessEnv {
      readonly NEXT_PUBLIC_API_URL: string;
      readonly NEXT_PUBLIC_APP_URL: string;
      readonly NODE_ENV: "development" | "production" | "test";
    }
  }
}

export interface SelectOption<T = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface SortParams<T = string> {
  field: T;
  direction: "asc" | "desc";
}

export type WithClassName<T = Record<string, never>> = T & {
  className?: string;
};

export type Nullable<T> = T | null;

export type AsyncState<T> = {
  data: Nullable<T>;
  loading: boolean;
  error: Nullable<string>;
};