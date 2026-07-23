"use client";

import { useEffect, useState } from "react";
import { useTheme as useNextTheme } from "next-themes";

interface UseThemeReturn {
  theme: string | undefined;
  resolvedTheme: string | undefined;
  setTheme: (theme: string) => void;
  toggleTheme: () => void;
  mounted: boolean;
  isDark: boolean;
}

export function useTheme(): UseThemeReturn {
  const { theme, resolvedTheme, setTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    mounted,
    isDark: resolvedTheme === "dark",
  };
}