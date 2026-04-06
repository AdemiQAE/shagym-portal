"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export default function NotFound() {
  return (
    <div className="container page anim-up" style={{ textAlign: "center", paddingTop: 80 }}>
      <div style={{
        width: 80, height: 80, borderRadius: "50%", background: "var(--bg-2)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "var(--text-4)", margin: "0 auto 24px"
      }}>
        <Icon name="file" size={40} />
      </div>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>404</h1>
      <p style={{ fontSize: 16, color: "var(--text-3)", marginBottom: 32 }}>
        Страница не найдена или была удалена.
      </p>
      <Link href="/" className="btn btn-primary btn-lg">
        Вернуться на главную
      </Link>
    </div>
  );
}
