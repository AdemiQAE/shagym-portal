"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/Icon";

export default function LoginPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", { ...form, redirect: false });
    if (result?.error) {
      setError(t("error_invalid"));
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="auth-page">
      <div className="anim-up" style={{ width: "100%", maxWidth: 400 }}>
        <div className="auth-mark">
          <Icon name="building" size={22} />
        </div>
        <h1 className="auth-title">{t("login_title")}</h1>
        <p className="auth-sub">{t("login_sub")}</p>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: 16 }}>
            <Icon name="warning" size={14} style={{ flexShrink: 0, marginTop: 1 }} />
            {error}
          </div>
        )}

        <div className="card auth-card" style={{ padding: "28px" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="field">
              <label className="field-label">{t("email")}</label>
              <input
                id="login-email"
                type="email"
                className="field-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
                autoComplete="email"
              />
            </div>

            <div className="field">
              <label className="field-label">{t("password")}</label>
              <input
                id="login-password"
                type="password"
                className="field-input"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              id="login-submit"
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: "100%", height: 38, marginTop: 4 }}
            >
              {loading
                ? <Icon name="loader" size={15} className="spin" />
                : <>{t("login_btn")} <Icon name="arrowRight" size={14} /></>
              }
            </button>

            <button
              type="button"
              className="btn"
              onClick={() => setForm({ email: "admin@shagym.kz", password: "admin" })}
              style={{ width: "100%", height: 38, marginTop: 4, background: "var(--bg-2)", border: "1px solid var(--border)", color: "var(--text-3)", fontSize: 13, gap: 8 }}
            >
              <Icon name="shield" size={14} /> Demo Admin
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "var(--text-3)" }}>
          {t("no_account")}{" "}
          <Link href="/auth/register" style={{ color: "var(--accent)", fontWeight: 500 }}>
            {t("register_link")}
          </Link>
        </p>
      </div>
    </div>
  );
}
