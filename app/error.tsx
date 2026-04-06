"use client";

import { useEffect } from "react";
import { Icon } from "@/components/ui/Icon";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
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
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Что-то пошло не так</h1>
      <p style={{ fontSize: 14, color: "var(--text-3)", marginBottom: 32, maxWidth: 400, margin: "0 auto 32px" }}>
        Произошла непредвиденная ошибка. Мы уже работаем над её исправлением.
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <button onClick={() => reset()} className="btn btn-primary">
          Попробовать снова
        </button>
        <button onClick={() => window.location.href = "/"} className="btn btn-secondary">
          На главную
        </button>
      </div>
    </div>
  );
}
