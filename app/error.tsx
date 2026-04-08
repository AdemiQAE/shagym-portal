"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/Icon";

/**
 * Global error boundary page.
 * Catches unhandled runtime errors and displays a localized
 * recovery UI with "retry" and "go home" actions.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errors");

  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <div className="container page anim-up" style={{ textAlign: "center", paddingTop: 80 }}>
      <div style={{
        width: 80, height: 80, borderRadius: "50%", background: "var(--red-low)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "var(--red)", margin: "0 auto 24px"
      }}>
        <Icon name="warning" size={40} />
      </div>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>{t("error_title")}</h1>
      <p style={{ fontSize: 14, color: "var(--text-3)", maxWidth: 400, margin: "0 auto 32px" }}>
        {t("error_text")}
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <button onClick={() => reset()} className="btn btn-primary">
          {t("retry")}
        </button>
        <button onClick={() => window.location.href = "/"} className="btn btn-secondary">
          {t("go_home")}
        </button>
      </div>
    </div>
  );
}
