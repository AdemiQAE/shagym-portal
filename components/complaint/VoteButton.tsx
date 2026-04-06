"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/Icon";

interface VoteButtonProps {
  complaintId: string;
  initialVotes: number;
  initialVoted: boolean;
}

/**
 * Кнопка голосования с поддержкой оптимистичного обновления интерфейса.
 * @param {string} complaintId ID жалобы
 * @param {number} initialVotes Начальное количество голосов
 * @param {boolean} initialVoted Проголосовал ли текущий пользователь
 */
export function VoteButton({ complaintId, initialVotes, initialVoted }: VoteButtonProps) {
  const t = useTranslations("complaint");
  const router = useRouter();
  const [votes, setVotes] = useState(initialVotes);
  const [voted, setVoted] = useState(initialVoted);
  const [loading, setLoading] = useState(false);

  const handleVote = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;
    setLoading(true);

    const isVoting = !voted;
    
    // Optimistic update
    setVoted(isVoting);
    setVotes(prev => isVoting ? prev + 1 : prev - 1);

    try {
      const res = await fetch("/api/votes", {
        method: isVoting ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ complaintId }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          router.push("/auth/login");
          // Revert on auth error
          setVoted(!isVoting);
          setVotes(prev => isVoting ? prev - 1 : prev + 1);
          return;
        }
        throw new Error("Failed to vote");
      }
    } catch (err) {
      console.error("Vote error:", err);
      // Revert on error
      setVoted(!isVoting);
      setVotes(prev => isVoting ? prev - 1 : prev + 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`vote-control ${voted ? "voted" : ""} ${loading ? "loading" : ""}`}
      onClick={handleVote}
      disabled={loading}
      aria-label={voted ? t("voted") : t("vote")}
    >
      <Icon name="arrowUp" size={14} />
      <span>{votes}</span>

      <style jsx>{`
        .vote-control {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          width: 44px;
          height: 56px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border);
          background: var(--surface);
          color: var(--text-3);
          transition: all 0.2s var(--ease);
          cursor: pointer;
        }
        .vote-control:hover:not(.loading) {
          border-color: var(--accent-mid);
          background: var(--accent-low);
          color: var(--accent);
          transform: translateY(-2px);
        }
        .vote-control.voted {
          background: var(--accent);
          border-color: var(--accent);
          color: #fff;
          box-shadow: 0 4px 12px rgba(33, 87, 243, 0.3);
        }
        .vote-control.loading {
          cursor: wait;
          opacity: 0.7;
        }
        .vote-control span {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: -0.02em;
        }
      `}</style>
    </button>
  );
}
