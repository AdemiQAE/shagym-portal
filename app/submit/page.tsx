"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/Icon";
import { ImageUploader } from "@/components/ui/ImageUploader";

const CATEGORIES = ["road", "housing", "ecology", "safety", "education", "other"];

export default function SubmitPage() {
  const t = useTranslations();
  const router = useRouter();

  const [form, setForm] = useState({
    title: "", description: "", category: "road",
    location: "", isAnonymous: false, images: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");
  const [success, setSuccess] = useState(false);

  const set = (k: string, v: string | boolean | string[]) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      setError(t("submit.error_empty")); return;
    }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      const data = await res.json();
      setSuccess(true);
      setTimeout(() => router.push(`/complaints/${data.id}`), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container page-narrow">
        <div className="empty" style={{ paddingTop: 80 }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--green-low)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--green)", marginBottom: 8 }}>
            <Icon name="check" size={24} />
          </div>
          <p className="empty-title">{t("submit.success")}</p>
          <div style={{ width: 20, height: 20, border: "2px solid var(--border-3)", borderTopColor: "var(--accent)", borderRadius: "50%", marginTop: 12 }} className="spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container page page-narrow anim-up">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 6 }}>
          {t("submit.title")}
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-3)" }}>{t("submit.subtitle")}</p>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: 20 }}>
          <Icon name="warning" size={14} style={{ flexShrink: 0 }} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {/* Title */}
        <div className="field">
          <label className="field-label">{t("submit.field_title")} *</label>
          <input
            id="title" className="field-input" maxLength={200} required
            placeholder={t("submit.field_title_placeholder")}
            value={form.title}
            onChange={e => set("title", e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="field">
          <label className="field-label">{t("submit.field_description")} *</label>
          <textarea
            id="description" className="field-textarea" required
            placeholder={t("submit.field_description_placeholder")}
            value={form.description}
            onChange={e => set("description", e.target.value)}
            rows={5}
            style={{ minHeight: 140 }}
          />
        </div>

        {/* Category + Location */}
        <div className="submit-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div className="field">
            <label className="field-label">{t("submit.field_category")}</label>
            <select
              id="category" className="field-select"
              value={form.category}
              onChange={e => set("category", e.target.value)}
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{t(`categories.${c}` as any)}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label className="field-label">{t("submit.field_location")}</label>
            <input
              id="location" className="field-input"
              placeholder={t("submit.field_location_placeholder")}
              value={form.location}
              onChange={e => set("location", e.target.value)}
            />
          </div>
        </div>

        {/* Photos */}
        <div className="field">
            <label className="field-label">{t("submit.field_photos")}</label>
            <ImageUploader
              value={form.images}
              onChange={val => set("images", val)}
              maxFiles={4}
            />
          </div>

        {/* Anonymous */}
        <label className="check-row">
          <input
            type="checkbox" id="anon"
            checked={form.isAnonymous}
            onChange={e => set("isAnonymous", e.target.checked)}
          />
          <div className="check-body">
            <div className="check-title">{t("submit.field_anonymous")}</div>
            <div className="check-hint">{t("submit.field_anonymous_hint")}</div>
          </div>
        </label>

        <div className="divider" />

        <button id="submit-btn" type="submit" className="btn btn-primary btn-lg" disabled={loading}>
          {loading
            ? <Icon name="loader" size={16} className="spin" />
            : <><Icon name="send" size={15} /> {t("submit.submit_btn")}</>
          }
        </button>
      </form>
    </div>
  );
}
