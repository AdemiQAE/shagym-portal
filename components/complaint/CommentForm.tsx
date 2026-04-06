"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/Icon";

interface CommentFormProps {
  complaintId: string;
}

export function CommentForm({ complaintId }: CommentFormProps) {
  const t = useTranslations("complaint");
  const router = useRouter();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || loading) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/complaints/${complaintId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim() }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          router.push("/auth/login");
          return;
        }
        const data = await res.json();
        throw new Error(data.error || "Failed to post comment");
      }

      setText("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error posting comment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form card">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t("comments_placeholder") || "Напишите комментарий..."}
        required
        disabled={loading}
        className="comment-textarea"
        rows={3}
      />
      
      {error && <p className="comment-error">{error}</p>}

      <div className="comment-footer">
        <button 
          type="submit" 
          className={`btn btn-primary btn-sm ${loading ? "loading" : ""}`}
          disabled={loading || !text.trim()}
        >
          {loading ? (
            <Icon name="loader" size={14} className="animate-spin" />
          ) : (
            <>
              <Icon name="send" size={14} />
              <span>{t("comments_submit") || "Отправить"}</span>
            </>
          )}
        </button>
      </div>

      <style jsx>{`
        .comment-form {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 16px;
          border: 1px solid var(--border);
          background: var(--surface);
        }
        .comment-textarea {
          width: 100%;
          border: 1px solid var(--border);
          background: var(--bg-2);
          color: var(--text);
          border-radius: var(--radius-md);
          padding: 12px;
          font-size: 14px;
          resize: none;
          transition: border-color 0.2s;
        }
        .comment-textarea:focus {
          outline: none;
          border-color: var(--accent);
          background: var(--surface);
        }
        .comment-footer {
          display: flex;
          justify-content: flex-end;
        }
        .comment-error {
          font-size: 12px;
          color: var(--red);
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </form>
  );
}
