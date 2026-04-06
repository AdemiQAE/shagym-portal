"use client";

import { useEffect, useState } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme") ?? "light";
    document.documentElement.setAttribute("data-theme", saved);
    setMounted(true);
  }, []);

  if (!mounted) return <>{children}</>;
  return <>{children}</>;
}
