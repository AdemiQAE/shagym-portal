import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { StatusBadge } from "@/components/complaint/StatusBadge";
import { Icon } from "@/components/ui/Icon";
import Image from "next/image";
import { ComplaintStatus } from "@prisma/client";

/**
 * Returns a localized relative time string (e.g. "5м назад").
 * @param d - Date to compare against now
 * @param t - next-intl translation function
 */
function timeAgo(d: Date, t: (key: string, values?: any) => string): string {
  const seconds = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (seconds < 60) return t("time.ago_s", { s: seconds });
  if (seconds < 3600) return t("time.ago_m", { m: Math.floor(seconds / 60) });
  if (seconds < 86400) return t("time.ago_h", { h: Math.floor(seconds / 3600) });
  return t("time.ago_d", { d: Math.floor(seconds / 86400) });
}

export default async function CabinetPage() {
  const session = await auth();
  const t = await getTranslations();
  if (!session?.user) redirect("/auth/login");
  const userId = session.user.id;

  const complaints = await prisma.complaint.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { votes: true } } },
  });

  const total = complaints.length;
  const pending = complaints.filter((c: { status: ComplaintStatus }) => 
    ["PENDING", "ACCEPTED", "IN_PROGRESS"].includes(c.status)
  ).length;
  const resolved = complaints.filter((c: { status: ComplaintStatus }) => c.status === "RESOLVED").length;
  const resolvedPct = total > 0 ? Math.round((resolved / total) * 100) : 0;

  const stats = [
    { label: t("cabinet.stat_total"),    value: total,    color: "var(--text)",    pct: total > 0 ? 100 : 0 },
    { label: t("cabinet.stat_pending"),  value: pending,  color: "var(--accent)",  pct: total > 0 ? Math.round((pending / total) * 100) : 0 },
    { label: t("cabinet.stat_resolved"), value: resolved, color: "var(--green)",   pct: resolvedPct },
  ];

  const initials = (session.user.name ?? session.user.email ?? "U")[0].toUpperCase();

  return (
    <div className="container page page-mid anim-up">
      {/* ── Profile banner ─────────────────── */}
      <div className="profile-banner">
        <div className="profile-banner-bg" aria-hidden="true" />
        <div className="profile-banner-body">
          <div className="avatar avatar-xl profile-avatar">{initials}</div>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text)" }}>
              {session.user.name ?? "—"}
            </h1>
            <p style={{ fontSize: 13, color: "var(--text-3)", marginTop: 2 }}>{session.user.email}</p>
          </div>
        </div>
      </div>

      {/* ── Stats ──────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10, marginBottom: 32 }}>
        {stats.map(s => (
          <div key={s.label} className="card stat-card">
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            {/* Progress bar */}
            <div style={{ marginTop: 10, height: 3, borderRadius: 99, background: "var(--bg-3)", overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${s.pct}%`,
                borderRadius: 99,
                background: s.color,
                transition: "width 0.6s var(--ease)",
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* ── List ───────────────────────────── */}
      <div className="section-head">
        <div>
          <h2 className="section-title">{t("cabinet.my_complaints")}</h2>
        </div>
        <Link href="/submit" className="btn btn-primary btn-sm">
          <Icon name="plus" size={13} />
          {t("nav.submit")}
        </Link>
      </div>

      {complaints.length === 0 ? (
        <div className="card">
          <div className="empty">
            <Icon name="file" size={36} className="empty-icon" />
            <p className="empty-title">{t("cabinet.empty")}</p>
            <Link href="/submit" className="btn btn-secondary btn-sm" style={{ marginTop: 8 }}>
              {t("cabinet.submit_first")}
            </Link>
          </div>
        </div>
      ) : (
        <div className="card" style={{ overflow: "hidden" }}>
          {complaints.map((c, i) => (
            <Link key={c.id} href={`/complaints/${c.id}`} style={{ display: "block" }}>
              <div className={`cabinet-item cat-border-${c.category}`} style={{
                borderBottom: i < complaints.length - 1 ? "1px solid var(--border)" : "none",
              }}>
                {c.images[0] && (
                  <Image src={c.images[0]} alt={c.title} width={44} height={44} unoptimized={c.images[0].startsWith("data:")} style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover", border: "1px solid var(--border)", flexShrink: 0 }} />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: 14, letterSpacing: "-0.01em", color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {c.title}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 5 }}>
                    <StatusBadge status={c.status} />
                    <span style={{ fontSize: 11.5, color: "var(--text-4)", display: "flex", alignItems: "center", gap: 3 }}>
                      <Icon name="arrowUp" size={10} /> {c._count.votes}
                    </span>
                    <span style={{ fontSize: 11.5, color: "var(--text-4)", display: "flex", alignItems: "center", gap: 3, marginLeft: "auto" }}>
                      <Icon name="clock" size={10} /> {timeAgo(c.createdAt, t)}
                    </span>
                  </div>
                </div>
                <Icon name="chevronRight" size={14} style={{ color: "var(--text-4)", flexShrink: 0 }} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
