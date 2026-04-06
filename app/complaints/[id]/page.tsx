import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { StatusBadge } from "@/components/complaint/StatusBadge";
import { VoteButton } from "@/components/complaint/VoteButton";
import { Icon, IconName } from "@/components/ui/Icon";
import Link from "next/link";
import { cookies } from "next/headers";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const c = await prisma.complaint.findUnique({ where: { id }, select: { title: true, description: true } });
  if (!c) return {};
  return { title: `${c.title} — Шағым`, description: c.description.slice(0, 160) };
}

function fmtDate(d: Date, locale: string) {
  return new Date(d).toLocaleDateString(locale === "kz" ? "kk-KZ" : "ru-RU", { day: "numeric", month: "long", year: "numeric" });
}
function timeAgo(d: Date, t: (key: string, values?: any) => string): string {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return t("time.ago_s", { s });
  if (s < 3600) return t("time.ago_m", { m: Math.floor(s / 60) });
  if (s < 86400) return t("time.ago_h", { h: Math.floor(s / 3600) });
  return t("time.ago_d", { d: Math.floor(s / 86400) });
}

const STATUS_ICON: Record<string, IconName> = {
  PENDING: "clock", ACCEPTED: "check", IN_PROGRESS: "loader", RESOLVED: "check", CANCELLED: "x",
};

export default async function ComplaintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await getTranslations();
  const session = await auth();
  const locale = (await cookies()).get("locale")?.value || "ru";
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
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!complaint) notFound();

  const votedByMe = userId
    ? !!(await prisma.vote.findUnique({ where: { userId_complaintId: { userId, complaintId: id } } }))
    : false;

  return (
    <div className="container page anim-up" style={{ maxWidth: 900 }}>
      {/* Breadcrumb */}
      <nav style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 28, fontSize: 12.5, color: "var(--text-4)" }}>
        <Link href="/" style={{ color: "var(--text-4)", display: "flex", alignItems: "center", gap: 4 }}>
          <Icon name="grid" size={12} /> {t("nav.feed")}
        </Link>
        <Icon name="chevronRight" size={11} />
        <span style={{ color: "var(--text-3)" }}>#{id.slice(0, 8)}</span>
      </nav>

      <div className="two-col">
        {/* Left — main */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Header */}
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <VoteButton
              complaintId={complaint.id}
              initialCount={complaint._count.votes}
              initialVoted={votedByMe}
              isLoggedIn={!!session}
              size="large"
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 style={{ fontSize: 21, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.3, marginBottom: 10 }}>
                {complaint.title}
              </h1>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6 }}>
                <StatusBadge status={complaint.status} />
                <span className="badge badge-neutral">
                  <Icon name={
                    (({ road: "road", housing: "home", ecology: "leaf",
                      safety: "shield", education: "book", other: "file" } as Record<string, IconName>)[complaint.category] || "file") as IconName
                  } size={11} />
                  {t(`categories.${complaint.category}` as any)}
                </span>
                {complaint.location && (
                  <span className="badge badge-neutral">
                    <Icon name="mapPin" size={11} />
                    {complaint.location}
                  </span>
                )}
                <span className="badge badge-neutral">
                  <Icon name="user" size={11} />
                  {complaint.isAnonymous ? t("complaint.anonymous") : complaint.author.name}
                </span>
                <span style={{ marginLeft: "auto", fontSize: 12, color: "var(--text-4)", display: "flex", alignItems: "center", gap: 4 }}>
                  <Icon name="calendar" size={12} />
                  {fmtDate(complaint.createdAt, locale)}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="card" style={{ padding: "20px 22px" }}>
            <p style={{ fontSize: 14.5, lineHeight: 1.75, color: "var(--text-2)", whiteSpace: "pre-wrap" }}>
              {complaint.description}
            </p>
          </div>

          {/* Photos */}
          {complaint.images.length > 0 && (
            <div className="card" style={{ padding: 16 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-4)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
                {t("submit.field_photos")}
              </p>
              <div className="photo-grid">
                {complaint.images.map((img, i) => (
                  <img key={i} src={img} alt="" />
                ))}
              </div>
            </div>
          )}

          {/* Comments */}
          {complaint.comments.length > 0 && (
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-3)", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                <Icon name="info" size={13} />
                {t("complaint.comments")} · {complaint.comments.length}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {complaint.comments.map((c) => (
                  <div key={c.id} className="card" style={{ padding: "12px 16px", display: "flex", gap: 12 }}>
                    <div className="avatar avatar-sm">{(c.author.name ?? "?")[0]}</div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontWeight: 600, fontSize: 12.5 }}>{c.author.name}</span>
                        <span style={{ fontSize: 11.5, color: "var(--text-4)" }}>{timeAgo(c.createdAt, t)}</span>
                      </div>
                      <p style={{ fontSize: 13.5, lineHeight: 1.5, color: "var(--text-2)" }}>{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right — timeline */}
        <div className="sticky-sidebar">
          <div className="card" style={{ padding: "18px 20px" }}>
            <p style={{ fontSize: 11.5, fontWeight: 600, color: "var(--text-4)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 18 }}>
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
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text)" }}>{t("complaint.submitted_lbl")}</span>
                    <span className="timeline-date">{timeAgo(complaint.createdAt, t)}</span>
                  </div>
                  <p style={{ fontSize: 11.5, color: "var(--text-4)" }}>{fmtDate(complaint.createdAt, locale)}</p>
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
                      <p style={{ fontSize: 12.5, color: "var(--text-3)", marginTop: 6, lineHeight: 1.5 }}>{log.comment}</p>
                    )}
                    {log.changedBy.role === "ADMIN" && (
                      <p style={{ fontSize: 11, color: "var(--text-4)", marginTop: 4 }}>🏛️ {log.changedBy.name}</p>
                    )}
                    {log.images?.length > 0 && (
                      <div className="photo-grid" style={{ marginTop: 8 }}>
                        {log.images.map((img: string, j: number) => <img key={j} src={img} alt="" />)}
                      </div>
                    )}
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
