"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/Icon";

interface VoteButtonProps {
  complaintId: string;
  initialCount: number;
  initialVoted: boolean;
  isLoggedIn: boolean;
  size?: "card" | "large";
}

export function VoteButton({ complaintId, initialCount, initialVoted, isLoggedIn, size = "large" }: VoteButtonProps) {
  const t = useTranslations("complaint");
  const [voted, setVoted] = useState(initialVoted);
  const [count, setCount] = useState(initialCount);
  const [isPending, startTransition] = useTransition();

  const handleVote = () => {
    if (!isLoggedIn) { window.location.href = "/auth/login"; return; }
    const wasVoted = voted;
    setVoted(!wasVoted);
    setCount(wasVoted ? count - 1 : count + 1);

    startTransition(async () => {
      try {
        const res = await fetch("/api/votes", {
          method: wasVoted ? "DELETE" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ complaintId }),
        });
        if (!res.ok) { setVoted(wasVoted); setCount(wasVoted ? count + 1 : count - 1); }
      } catch {
        setVoted(wasVoted);
        setCount(wasVoted ? count + 1 : count - 1);
      }
    });
  };

  if (size === "card") {
    return (
      <button
        className={`vote-control${voted ? " voted" : ""}`}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleVote(); }}
        disabled={isPending}
        title={voted ? t("voted") : t("vote")}
      >
        <Icon name="arrowUp" size={14} />
        <span>{count}</span>
      </button>
    );
  }

  return (
    <button
      className={`vote-btn-large${voted ? " voted" : ""}`}
      onClick={handleVote}
      disabled={isPending}
    >
      <Icon name="arrowUp" size={18} style={{ transition: "transform 200ms" }} />
      <span className="vote-count">{count}</span>
      <span className="vote-label">{voted ? t("voted") : t("vote")}</span>
    </button>
  );
}
