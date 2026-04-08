"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/Icon";

/**
 * Global 404 page rendered when no route matches.
 * Displays a localized message and a link back to the homepage.
 */
export default function NotFound() {
  const t = useTranslations("errors");

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
      <p style={{ fontSize: 16, color: "var(--text-3)", marginBottom: 8 }}>
        {t("not_found")}
      </p>
      <p style={{ fontSize: 14, color: "var(--text-4)", marginBottom: 32, maxWidth: 400, margin: "0 auto 32px" }}>
        {t("not_found_text")}
      </p>
      <Link href="/" className="btn btn-primary btn-lg">
        <Icon name="home" size={15} />
        {t("back_home")}
      </Link>
    </div>
  );
}
