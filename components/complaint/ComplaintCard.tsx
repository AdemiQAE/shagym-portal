import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { StatusBadge } from "./StatusBadge";
import { VoteButton } from "./VoteButton";
import { Icon } from "@/components/ui/Icon";
import type { IconName } from "@/components/ui/Icon";

type Complaint = {
  id: string;
  title: string;
  description: string;
  category: string;
  location?: string | null;
  status: "PENDING" | "ACCEPTED" | "IN_PROGRESS" | "RESOLVED" | "CANCELLED";
  isAnonymous: boolean;
  images: string[];
  votesCount: number;
  createdAt: Date | string;
  author: { name?: string | null };
  _count?: { votes: number };
};

const CATEGORY_ICONS: Record<string, IconName> = {
  road: "road", housing: "home", ecology: "leaf",
  safety: "shield", education: "book", other: "file",
};

function timeAgo(d: Date | string, t: (key: string, values?: any) => string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  const s = Math.floor((Date.now() - date.getTime()) / 1000);
  if (s < 60) return t("time.ago_s", { s });
  if (s < 3600) return t("time.ago_m", { m: Math.floor(s / 60) });
  if (s < 86400) return t("time.ago_h", { h: Math.floor(s / 3600) });
  return t("time.ago_d", { d: Math.floor(s / 86400) });
}

interface ComplaintCardProps {
  complaint: Complaint;
  votedByMe?: boolean;
}

export function ComplaintCard({ complaint, votedByMe }: ComplaintCardProps) {
  const t = useTranslations();
  const votes = complaint._count?.votes ?? complaint.votesCount;
  const catIcon = CATEGORY_ICONS[complaint.category] ?? "file";

  return (
    <Link href={`/complaints/${complaint.id}`} style={{ display: "block" }}>
      <div className={`card card-interactive complaint-card cat-border-${complaint.category}`}>
        {/* Vote */}
        <div className="vote-col">
          <VoteButton 
            complaintId={complaint.id} 
            initialVotes={votes} 
            initialVoted={!!votedByMe} 
          />
        </div>

        {/* Body */}
        <div className="complaint-body">
          <p className="complaint-title">{complaint.title}</p>
          <p className="complaint-desc">{complaint.description}</p>
          <div className="complaint-meta">
            <StatusBadge status={complaint.status} />

            <span className="badge badge-neutral" style={{ gap: 4 }}>
              <Icon name={catIcon} size={11} />
              {t(`categories.${complaint.category.toLowerCase()}` as any)}
            </span>

            {complaint.location && (
              <span className="meta-item">
                <Icon name="mapPin" size={11} />
                {complaint.location}
              </span>
            )}

            <span className="meta-item" style={{ marginLeft: "auto" }}>
              <Icon name="clock" size={11} />
              {timeAgo(complaint.createdAt, t)}
            </span>
          </div>
        </div>

        {/* Thumb */}
        {complaint.images?.[0] && (
          <div className="complaint-thumb-wrap">
            <Image
              src={complaint.images[0]}
              alt={complaint.title}
              width={72}
              height={72}
              className="complaint-thumb"
              unoptimized={complaint.images[0].startsWith("data:")}
            />
          </div>
        )}
      </div>
    </Link>
  );
}
