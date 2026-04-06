import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { getTranslations } from "next-intl/server";
import { ComplaintCard } from "@/components/complaint/ComplaintCard";
import { Icon } from "@/components/ui/Icon";
import Link from "next/link";
import { Prisma } from "@prisma/client";

export default async function HomePage({ searchParams }: { searchParams: Promise<{ sort?: string; category?: string }> }) {
  const t = await getTranslations();
  const session = await auth();
  const userId = session?.user?.id;
  const params = await searchParams;

  const sort     = params.sort ?? "top";
  const category = params.category;

  const where: Prisma.ComplaintWhereInput = {};
  if (category && category !== "all") where.category = category;
  if (sort === "resolved") where.status = "RESOLVED";

  const orderBy = sort === "new"
    ? { createdAt: "desc" as const }
    : { votesCount: "desc" as const };

  const [complaints, totalComplaints, resolvedCount, totalVotes] = await Promise.all([
    prisma.complaint.findMany({
      where,
      orderBy,
      take: 50,
      include: {
        author: { select: { name: true } },
        _count: { select: { votes: true } },
      },
    }),
    prisma.complaint.count(),
    prisma.complaint.count({ where: { status: "RESOLVED" } }),
    prisma.vote.count(),
  ]);

  const userVoteIds = userId
    ? new Set(
        (await prisma.vote.findMany({
          where: { userId, complaintId: { in: complaints.map(c => c.id) } },
          select: { complaintId: true },
        })).map(v => v.complaintId)
      )
    : new Set<string>();

  const categories = ["all", "road", "housing", "ecology", "safety", "education", "other"];
  const sorts = [
    { key: "top", label: t("feed.sort_top") },
    { key: "new", label: t("feed.sort_new") },
    { key: "resolved", label: t("feed.sort_resolved") },
  ];

  const usps = [
    { icon: "shield" as const, text: t("hero.usp_1") },
    { icon: "arrowUp" as const, text: t("hero.usp_2") },
    { icon: "check" as const, text: t("hero.usp_3") },
  ];

  return (
    <div className="container page">
      {/* ── Hero ─────────────────────────────── */}
      <section className="hero anim-up" style={{ position: "relative", overflow: "hidden" }}>
        {/* Grid pattern background */}
        <div className="hero-grid-bg" aria-hidden="true" />

        <div className="hero-eyebrow">
          <span className="hero-eyebrow-dot hero-eyebrow-pulse" />
          {t("hero.eyebrow")}
        </div>

        <h1 className="hero-title">
          {t("hero.title").split(" ").slice(0, -2).join(" ")}{" "}
          <em>{t("hero.title").split(" ").slice(-2).join(" ")}</em>
        </h1>

        <p className="hero-sub">{t("hero.subtitle")}</p>

        {/* USP chips */}
        <div className="hero-usps">
          {usps.map((u, i) => (
            <span key={i} className="hero-usp-chip">
              <Icon name={u.icon} size={12} />
              {u.text}
            </span>
          ))}
        </div>

        <div className="hero-actions">
          {session ? (
            <Link href="/submit" className="btn btn-primary btn-lg">
              <Icon name="plus" size={15} />
              {t("hero.cta")}
            </Link>
          ) : (
            <>
              <Link href="/auth/register" className="btn btn-primary btn-lg">
                <Icon name="plus" size={15} />
                {t("hero.cta")}
              </Link>
              <Link href="/auth/login" className="btn btn-secondary btn-lg">
                {t("nav.login")}
                <Icon name="arrowRight" size={14} />
              </Link>
            </>
          )}
        </div>

        {/* Stats */}
        <div className="hero-stats">
          <div className="hero-stat-card">
            <div className="hero-stat-value">{totalComplaints.toLocaleString()}</div>
            <div className="hero-stat-label">{t("hero.stats_complaints")}</div>
          </div>
          <div className="hero-stat-card">
            <div className="hero-stat-value" style={{ color: "var(--green)" }}>{resolvedCount.toLocaleString()}</div>
            <div className="hero-stat-label">{t("hero.stats_resolved")}</div>
          </div>
          <div className="hero-stat-card">
            <div className="hero-stat-value" style={{ color: "var(--accent)" }}>{totalVotes.toLocaleString()}</div>
            <div className="hero-stat-label">{t("hero.stats_votes")}</div>
          </div>
        </div>
      </section>

      {/* ── Filter bar ───────────────────────── */}
      <div className="filter-bar anim-up-2">
        {sorts.map((s) => (
          <Link key={s.key} href={`/?sort=${s.key}${category ? `&category=${category}` : ""}`}>
            <button className={`filter-pill${sort === s.key ? " active" : ""}`}>{s.label}</button>
          </Link>
        ))}
        <div className="filter-divider" />
        {categories.map((cat) => (
          <Link key={cat} href={`/?sort=${sort}&category=${cat}`}>
            <button className={`filter-pill${(!category && cat === "all") || category === cat ? " active" : ""}`}>
              {cat !== "all" && <Icon name={
                { road: "road", housing: "home", ecology: "leaf", safety: "shield", education: "book", other: "file" }[cat] as any
              } size={12} />}
              {t(`categories.${cat}` as any)}
            </button>
          </Link>
        ))}
      </div>

      {/* ── Feed ─────────────────────────────── */}
      <div className="feed-grid anim-up-3">
        {complaints.length === 0 ? (
          <div className="empty" style={{ gridColumn: "1/-1" }}>
            <Icon name="file" size={40} className="empty-icon" />
            <p className="empty-title">{t("feed.empty")}</p>
          </div>
        ) : (
          complaints.map((c) => (
            <ComplaintCard
              key={c.id}
              complaint={c as any}
              votedByMe={userVoteIds.has(c.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
