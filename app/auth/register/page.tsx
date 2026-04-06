"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/Icon";

export default function RegisterPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) { setError(t("error_password_len")); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Қате");
      await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="anim-up" style={{ width: "100%", maxWidth: 400 }}>
        <div className="auth-mark">
          <Icon name="building" size={22} />
        </div>
        <h1 className="auth-title">{t("register_title")}</h1>
        <p className="auth-sub">{t("register_sub")}</p>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: 16 }}>
            <Icon name="warning" size={14} style={{ flexShrink: 0, marginTop: 1 }} />
            {error}
          </div>
        )}

        <div className="card" style={{ padding: "28px" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="field">
              <label className="field-label">{t("name")}</label>
              <input
                id="reg-name" type="text" className="field-input"
                placeholder="Иван Иванов"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
              />
            </div>
            <div className="field">
              <label className="field-label">{t("email")}</label>
              <input
                id="reg-email" type="email" className="field-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
              />
            </div>
            <div className="field">
              <label className="field-label">{t("password")}</label>
              <input
                id="reg-password" type="password" className="field-input"
                placeholder="Мин. 6 символ"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required minLength={6}
              />
            </div>
            <button
              id="reg-submit" type="submit" className="btn btn-primary"
              disabled={loading}
              style={{ width: "100%", height: 38, marginTop: 4 }}
            >
              {loading
                ? <Icon name="loader" size={15} className="spin" />
                : <>{t("register_btn")} <Icon name="arrowRight" size={14} /></>
              }
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "var(--text-3)" }}>
          {t("has_account")}{" "}
          <Link href="/auth/login" style={{ color: "var(--accent)", fontWeight: 500 }}>
            {t("login_link")}
          </Link>
        </p>
      </div>
    </div>
  );
}
