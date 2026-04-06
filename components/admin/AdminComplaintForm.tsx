"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ComplaintStatus } from "@prisma/client";
import { Icon } from "@/components/ui/Icon";
import { ImageUploader } from "@/components/ui/ImageUploader";

interface AdminComplaintFormProps {
  complaintId: string;
  currentStatus: ComplaintStatus;
}

const STATUSES: ComplaintStatus[] = ["PENDING", "ACCEPTED", "IN_PROGRESS", "RESOLVED", "CANCELLED"];

export function AdminComplaintForm({ complaintId, currentStatus }: AdminComplaintFormProps) {
  const t = useTranslations("status");
  const router = useRouter();
  const [status, setStatus] = useState<ComplaintStatus>(currentStatus);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch(`/api/complaints/${complaintId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, comment, images }),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed to update status");
      }

      setSuccess(true);
      setComment("");
      setImages([]);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card admin-status-form" style={{ padding: 24, background: "var(--bg-2)" }}>
      <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
        <Icon name="shield" size={18} />
        Управление статусом
      </h3>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div className="field">
          <label className="field-label">Новый статус</label>
          <div className="status-selector" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 8 }}>
            {STATUSES.map((s) => (
              <button
                key={s}
                type="button"
                className={`status-btn ${status === s ? "active" : ""}`}
                onClick={() => setStatus(s)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border)",
                  background: status === s ? "var(--accent)" : "var(--surface)",
                  color: status === s ? "#fff" : "var(--text-2)",
                  fontSize: 13,
                  fontWeight: 600,
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                {t(s)}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <label className="field-label">Комментарий администратора</label>
          <textarea
            className="field-textarea"
            placeholder="Опишите предпринятые действия или причину смены статуса..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
          />
        </div>

        <div className="field">
          <label className="field-label">Фотографии (опционально)</label>
          <ImageUploader
            value={images}
            onChange={setImages}
            maxFiles={4}
          />
        </div>

        {error && (
          <div className="alert alert-error">
            <Icon name="warning" size={14} />
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success" style={{ background: "var(--green-low)", color: "var(--green)", border: "1px solid var(--green)" }}>
            <Icon name="check" size={14} />
            Статус успешно обновлен
          </div>
        )}

        <button
          type="submit"
          className={`btn btn-primary btn-lg ${loading ? "loading" : ""}`}
          disabled={loading || status === currentStatus}
          style={{ height: 48 }}
        >
          {loading ? (
            <Icon name="loader" size={20} className="animate-spin" />
          ) : (
            "Обновить статус"
          )}
        </button>
      </form>

      <style jsx>{`
        .status-btn:hover:not(.active) {
          border-color: var(--accent-mid);
          background: var(--accent-low);
          color: var(--accent);
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
