import { useTranslations } from "next-intl";

type ComplaintStatus = "PENDING" | "ACCEPTED" | "IN_PROGRESS" | "RESOLVED" | "CANCELLED";

const STATUS_CONFIG: Record<ComplaintStatus, { icon: "clock" | "check" | "arrowUp" | "loader" | "x"; cls: string; }> = {
  PENDING:     { icon: "clock",   cls: "badge-pending"    },
  ACCEPTED:    { icon: "check",   cls: "badge-accepted"   },
  IN_PROGRESS: { icon: "loader",  cls: "badge-in_progress"},
  RESOLVED:    { icon: "check",   cls: "badge-resolved"   },
  CANCELLED:   { icon: "x",       cls: "badge-cancelled"  },
};

export function StatusBadge({ status }: { status: ComplaintStatus }) {
  const t = useTranslations("status");
  const cfg = STATUS_CONFIG[status] ?? { icon: "info", cls: "badge-neutral" };

  return (
    <span className={`badge ${cfg.cls}`}>
      <span className="badge-dot" />
      {t(status)}
    </span>
  );
}
