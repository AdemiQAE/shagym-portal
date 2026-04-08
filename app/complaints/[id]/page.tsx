import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { StatusBadge } from "@/components/complaint/StatusBadge";
import { VoteButton } from "@/components/complaint/VoteButton";
import { CommentForm } from "@/components/complaint/CommentForm";
import { Icon, IconName } from "@/components/ui/Icon";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import type { Metadata } from "next";
import ComplaintMapWrapper from "@/components/complaint/ComplaintMapWrapper";

/** Generates dynamic <title> and <meta description> for complaint detail pages. */
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const c = await prisma.complaint.findUnique({ where: { id }, select: { title: true, description: true } });
  if (!c) return {};
  return { title: `${c.title} — Шағым`, description: c.description.slice(0, 160) };
}

/**
 * Formats a date into a localized long-form string (e.g. "5 апреля 2025").
 * @param d - Date to format
 * @param locale - "kz" for Kazakh, anything else for Russian
 */
function fmtDate(d: Date, locale: string) {
  return new Date(d).toLocaleDateString(locale === "kz" ? "kk-KZ" : "ru-RU", { day: "numeric", month: "long", year: "numeric" });
}

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

const STATUS_ICON: Record<string, IconName> = {
  PENDING: "clock", ACCEPTED: "check", IN_PROGRESS: "loader", RESOLVED: "check", CANCELLED: "x",
};

export default async function ComplaintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await getTranslations();
  const session = await auth();
  const locale = (await (await cookies()).get("locale"))?.value || "ru";
  const userId = session?.user?.id;

  const complaint = await prisma.complaint.findUnique({
    where: { id },
    include: {
      author: { select: { name: true } },
      _count: { select: { votes: true } },
      statusLogs: {
        include: { changedBy: { select: { name: true, role: true } } },
        orderBy: { createdAt: "asc" },
      },
      comments: {
        include: { author: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!complaint) notFound();

  const votedByMe = userId
    ? !!(await prisma.vote.findUnique({ where: { userId_complaintId: { userId, complaintId: id } } }))
    : false;

  const CATEGORY_ICONS: Record<string, IconName> = {
    road: "road", housing: "home", ecology: "leaf",
    safety: "shield", education: "book", other: "file",
  };

  const catIcon = CATEGORY_ICONS[complaint.category] ?? "file";

  return (
    <div className="container page anim-up" style={{ maxWidth: 1000 }}>
      {/* Breadcrumb */}
      <nav style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 28, fontSize: 13, color: "var(--text-4)" }}>
        <Link href="/" style={{ color: "var(--text-4)", display: "flex", alignItems: "center", gap: 6 }}>
          <Icon name="grid" size={14} /> {t("nav.feed")}
        </Link>
        <Icon name="chevronRight" size={12} />
        <span style={{ color: "var(--text-3)" }}>#{id.slice(0, 8)}</span>
      </nav>

      <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 32 }}>
        {/* Left — main */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Header */}
          <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
            <VoteButton
              complaintId={complaint.id}
              initialVotes={complaint._count.votes}
              initialVoted={votedByMe}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.2, marginBottom: 12 }}>
                {complaint.title}
              </h1>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
                <StatusBadge status={complaint.status} />
                <span className="badge badge-neutral" style={{ gap: 4 }}>
                  <Icon name={catIcon} size={11} />
                  {t(`categories.${complaint.category}` as any)}
                </span>
                {complaint.location && (
                  <span className="badge badge-neutral" style={{ gap: 4 }}>
                    <Icon name="mapPin" size={11} />
                    {complaint.location}
                  </span>
                )}
                <span className="badge badge-neutral" style={{ gap: 4 }}>
                  <Icon name="user" size={11} />
                  {complaint.isAnonymous ? t("complaint.anonymous") : (complaint.author.name || "User")}
                </span>
              </div>
            </div>
          </div>

          {/* Photos */}
          {complaint.images.length > 0 && (
            <div className="card" style={{ padding: 16 }}>
               <div className="photo-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
                {complaint.images.map((img, i) => (
                  <Image
                    key={i}
                    src={img}
                    alt={`${complaint.title} — фото ${i + 1}`}
                    width={400}
                    height={200}
                    unoptimized={img.startsWith("data:")}
                    style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "var(--radius-md)", border: "1px solid var(--border)" }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="card" style={{ padding: "24px 28px" }}>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: "var(--text-2)", whiteSpace: "pre-wrap" }}>
              {complaint.description}
            </p>
          </div>

          {/* Map */}
          {(complaint as any).latitude && (complaint as any).longitude && (
            <div className="card" style={{ padding: 16 }}>
               <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-4)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>
                {t("complaint.location")}
              </p>
              <ComplaintMapWrapper lat={(complaint as any).latitude} lng={(complaint as any).longitude} />
            </div>
          )}

          {/* Comments Section */}
          <div className="comments-section">
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="info" size={18} />
              {t("complaint.comments")} <span style={{ opacity: 0.5 }}>({complaint.comments.length})</span>
            </h3>

            {session ? (
              <CommentForm complaintId={id} />
            ) : (
              <div className="card" style={{ padding: 20, textAlign: "center", background: "var(--bg-2)" }}>
                <p style={{ fontSize: 14, color: "var(--text-3)", marginBottom: 12 }}>
                  {t("complaint.login_to_comment") || "Войдите, чтобы оставить комментарий"}
                </p>
                <Link href="/auth/login" className="btn btn-secondary btn-sm">{t("nav.login")}</Link>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 24 }}>
              {complaint.comments.map((c) => (
                <div key={c.id} className="card" style={{ padding: "16px 20px", display: "flex", gap: 16 }}>
                  <div className="avatar" style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--accent-low)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, flexShrink: 0 }}>
                    {(c.author.name ?? "U")[0].toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>{c.author.name || "User"}</span>
                      <span style={{ fontSize: 12, color: "var(--text-4)" }}>{timeAgo(c.createdAt, t)}</span>
                    </div>
                    <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "var(--text-2)" }}>{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — timeline */}
        <div className="sticky-sidebar">
          <div className="card" style={{ padding: "20px 24px" }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-4)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 20 }}>
              {t("complaint.timeline")}
            </p>

            <div className="timeline">
              {/* Submitted */}
              <div className="timeline-item">
                <div className="timeline-line" />
                <div className="timeline-icon">
                  <Icon name="send" size={12} />
                </div>
                <div className="timeline-body">
                  <div className="timeline-header">
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{t("complaint.submitted_lbl")}</span>
                    <span className="timeline-date">{timeAgo(complaint.createdAt, t)}</span>
                  </div>
                  <p style={{ fontSize: 12, color: "var(--text-4)" }}>{fmtDate(complaint.createdAt, locale)}</p>
                </div>
              </div>

              {complaint.statusLogs.map((log) => (
                <div key={log.id} className="timeline-item">
                  <div className="timeline-line" />
                  <div className="timeline-icon" style={{ background: "var(--accent-low)", borderColor: "var(--accent-mid)", color: "var(--accent)" }}>
                    <Icon name={STATUS_ICON[log.newStatus] ?? "clock"} size={12} />
                  </div>
                  <div className="timeline-body">
                    <div className="timeline-header">
                      <StatusBadge status={log.newStatus} />
                      <span className="timeline-date">{timeAgo(log.createdAt, t)}</span>
                    </div>
                    {log.comment && (
                      <p style={{ fontSize: 13, color: "var(--text-3)", marginTop: 8, lineHeight: 1.6 }}>{log.comment}</p>
                    )}
                    {log.images && log.images.length > 0 && (
                      <div className="photo-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 8, marginTop: 12 }}>
                        {log.images.map((img, i) => (
                          <Image
                            key={i}
                            src={img}
                            alt={`Отчёт — фото ${i + 1}`}
                            width={200}
                            height={100}
                            unoptimized={img.startsWith("data:")}
                            style={{ width: "100%", height: "100px", objectFit: "cover", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}
                          />
                        ))}
                      </div>
                    )}
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
                       <span style={{ fontSize: 11.5, color: "var(--text-4)" }}>
                        🏛️ {log.changedBy.role === "ADMIN" ? "Администратор" : "Пользователь"}: {log.changedBy.name}
                       </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
