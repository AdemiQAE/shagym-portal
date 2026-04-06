"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/Icon";
import { ImageUploader } from "@/components/ui/ImageUploader";
import dynamic from "next/dynamic";

const MapPicker = dynamic(() => import("@/components/ui/MapPicker"), {
  ssr: false,
  loading: () => <div className="map-placeholder" style={{ height: 300, background: "var(--bg-2)", borderRadius: "var(--radius-md)" }} />,
});

const CATEGORIES = ["road", "housing", "ecology", "safety", "education", "other"];

export default function SubmitPage() {
  const t = useTranslations();
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "road",
    location: "",
    latitude: null as number | null,
    longitude: null as number | null,
    isAnonymous: false,
    images: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      setError(t("submit.error_empty"));
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed to submit");
      }

      const data = await res.json();
      setSuccess(true);
      setTimeout(() => router.push(`/complaints/${data.id}`), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container page-narrow">
        <div className="empty" style={{ paddingTop: 80, textAlign: "center" }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%", background: "var(--green-low)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--green)", margin: "0 auto 16px"
          }}>
            <Icon name="check" size={32} />
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>{t("submit.success")}</h2>
          <div className="loader-dots" style={{ marginTop: 16 }}>
             <div className="dot" />
             <div className="dot" />
             <div className="dot" />
          </div>
        </div>
        <style jsx>{`
          .loader-dots { display: flex; justify-content: center; gap: 4px; }
          .dot { width: 8px; height: 8px; background: var(--accent); border-radius: 50%; animation: dot-pulse 1.5s infinite; }
          .dot:nth-child(2) { animation-delay: 0.2s; }
          .dot:nth-child(3) { animation-delay: 0.4s; }
          @keyframes dot-pulse {
            0%, 100% { opacity: 0.3; transform: scale(0.8); }
            50% { opacity: 1; transform: scale(1.1); }
          }
        `}</style>
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

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Title */}
        <div className="field">
          <label className="field-label">{t("submit.field_title")} *</label>
          <input
            className="field-input" maxLength={200} required
            placeholder={t("submit.field_title_placeholder")}
            value={form.title}
            onChange={e => set("title", e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="field">
          <label className="field-label">{t("submit.field_description")} *</label>
          <textarea
            className="field-textarea" required
            placeholder={t("submit.field_description_placeholder")}
            value={form.description}
            onChange={e => set("description", e.target.value)}
            rows={5}
            style={{ minHeight: 140 }}
          />
        </div>

        {/* Category + Location */}
        <div className="submit-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div className="field">
            <label className="field-label">{t("submit.field_category")}</label>
            <select
              className="field-select"
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
              className="field-input"
              placeholder={t("submit.field_location_placeholder")}
              value={form.location}
              onChange={e => set("location", e.target.value)}
            />
          </div>
        </div>

        {/* Map Picker */}
        <div className="field">
          <label className="field-label">{t("submit.field_map")}</label>
          <p style={{ fontSize: 12, color: "var(--text-4)", marginBottom: 8 }}>{t("submit.field_map_hint")}</p>
          <MapPicker
            lat={form.latitude || undefined}
            lng={form.longitude || undefined}
            onChange={(lat, lng) => {
              set("latitude", lat);
              set("longitude", lng);
            }}
          />
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
        <label className="check-row" style={{ cursor: "pointer", userSelect: "none" }}>
          <input
            type="checkbox"
            checked={form.isAnonymous}
            onChange={e => set("isAnonymous", e.target.checked)}
          />
          <div className="check-body">
            <div className="check-title" style={{ fontWeight: 600 }}>{t("submit.field_anonymous")}</div>
            <div className="check-hint" style={{ fontSize: 12, color: "var(--text-4)" }}>{t("submit.field_anonymous_hint")}</div>
          </div>
        </label>

        <div className="divider" style={{ height: 1, background: "var(--border)", margin: "8px 0" }} />

        <button
          type="submit"
          className={`btn btn-primary btn-lg ${loading ? "loading" : ""}`}
          disabled={loading}
          style={{ height: 48, fontSize: 16 }}
        >
          {loading ? (
            <Icon name="loader" size={20} className="animate-spin" />
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
              <Icon name="send" size={18} />
              {t("submit.submit_btn")}
            </div>
          )}
        </button>
      </form>
    </div>
  );
}
