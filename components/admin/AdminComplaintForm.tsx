"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { StatusBadge } from "@/components/complaint/StatusBadge";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { Icon } from "@/components/ui/Icon";

type ComplaintStatus = "PENDING" | "ACCEPTED" | "IN_PROGRESS" | "RESOLVED" | "CANCELLED";
const STATUSES: ComplaintStatus[] = ["PENDING", "ACCEPTED", "IN_PROGRESS", "RESOLVED", "CANCELLED"];

export function AdminComplaintForm({ complaintId, currentStatus }: { complaintId: string; currentStatus: ComplaintStatus }) {
  const t = useTranslations();
  const router = useRouter();
  const [status, setStatus]   = useState<ComplaintStatus>(currentStatus);
  const [comment, setComment] = useState("");
  const [images, setImages]   = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState("");

  const handleSave = async () => {
    setLoading(true); setSuccess(false); setError("");
    try {
      const res = await fetch(`/api/complaints/${complaintId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, comment, images }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      setSuccess(true);
      setComment(""); setImages([]);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {success && (
        <div className="alert alert-success">
          <Icon name="check" size={13} /> {t("admin.change_success")}
        </div>
      )}
      {error && (
        <div className="alert alert-error">
          <Icon name="warning" size={13} /> {error}
        </div>
      )}

      {/* Status picker */}
      <div className="field">
        <label className="field-label">{t("admin.change_status")}</label>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {STATUSES.map(s => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "9px 12px",
                borderRadius: "var(--radius-md)",
                border: `1.5px solid ${status === s ? "var(--accent)" : "var(--border-2)"}`,
                background: status === s ? "var(--accent-low)" : "transparent",
                cursor: "pointer",
                transition: "all 150ms",
              }}
            >
              <StatusBadge status={s} />
              {status === s && (
                <span style={{ color: "var(--accent)", display: "flex" }}>
                  <Icon name="check" size={14} />
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Report */}
      <div className="field">
        <label className="field-label">{t("admin.report_text")}</label>
        <textarea
          id="admin-comment"
          className="field-textarea"
          placeholder={t("admin.report_placeholder")}
          value={comment}
          onChange={e => setComment(e.target.value)}
          rows={3}
          style={{ minHeight: 90 }}
        />
      </div>

      <div className="field">
        <label className="field-label">{t("admin.report_photos")}</label>
        <ImageUploader value={images} onChange={setImages} maxFiles={6} />
      </div>

      <button
        id="admin-save"
        type="button"
        className="btn btn-primary"
        onClick={handleSave}
        disabled={loading}
      >
        {loading
          ? <Icon name="loader" size={15} className="spin" />
          : <><Icon name="save" size={14} /> {t("admin.save")}</>
        }
      </button>
    </div>
  );
}
