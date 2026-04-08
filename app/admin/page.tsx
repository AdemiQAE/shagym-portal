import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { StatusBadge } from "@/components/complaint/StatusBadge";
import { Icon } from "@/components/ui/Icon";
import { cookies } from "next/headers";
import { ComplaintStatus, Prisma } from "@prisma/client";

const STATUSES: ComplaintStatus[] = ["PENDING", "ACCEPTED", "IN_PROGRESS", "RESOLVED", "CANCELLED"];

/**
 * Formats a date into a short localized string (e.g. "5 апр.").
 * @param d - Date to format
 * @param locale - "kz" for Kazakh, anything else for Russian
 */
function fmtDate(d: Date, locale: string) {
  return new Date(d).toLocaleDateString(locale === "kz" ? "kk-KZ" : "ru-RU", { day: "numeric", month: "short" });
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string }>;
}) {
  const session = await auth();
  const t = await getTranslations();
  const locale = (await cookies()).get("locale")?.value || "ru";
  if (!session || session.user?.role !== "ADMIN") redirect("/");

  const params = await searchParams;
  const statusFilter = params.status as ComplaintStatus | "all" | undefined;
  const search = params.search;

  const where: Prisma.ComplaintWhereInput = {};
  if (statusFilter && statusFilter !== "all") where.status = statusFilter;
  if (search) where.OR = [
    { title: { contains: search, mode: "insensitive" } },
    { location: { contains: search, mode: "insensitive" } },
  ];

  const [complaints, counts] = await Promise.all([
    prisma.complaint.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { name: true, email: true } },
        _count: { select: { votes: true } },
      },
      take: 100,
    }),
    prisma.$transaction(STATUSES.map(s => prisma.complaint.count({ where: { status: s } }))),
  ]);

  const statusCounts = Object.fromEntries(STATUSES.map((s, i) => [s, counts[i]]));
  const total = counts.reduce((a: number, b: number) => a + b, 0);

  return (
    <div className="container page anim-up">
      <div className="admin-header">
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.04em" }}>
              {t("admin.title")}
            </h1>
            <p style={{ fontSize: 13, color: "var(--text-3)", marginTop: 4 }}>
              {total} {t("admin.all_complaints").toLowerCase()}
            </p>
          </div>
        </div>
      </div>

      {/* Status filter pills */}
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 16 }} className="admin-filters">
        <Link href="/admin">
          <button className={`filter-pill${!statusFilter || statusFilter === "all" ? " active" : ""}`}>
            {t("feed.filter_all")} <span style={{ opacity: 0.6, marginLeft: 2 }}>{total}</span>
          </button>
        </Link>
        {STATUSES.map(s => (
          <Link key={s} href={`/admin?status=${s}${search ? `&search=${search}` : ""}`}>
            <button className={`filter-pill${statusFilter === s ? " active" : ""}`}>
              <StatusBadge status={s} />
              <span style={{ opacity: 0.6, marginLeft: 2 }}>{statusCounts[s] ?? 0}</span>
            </button>
          </Link>
        ))}
      </div>

      {/* Search */}
      <form action="/admin" method="GET" style={{ marginBottom: 16 }}>
        {statusFilter && statusFilter !== "all" && <input type="hidden" name="status" value={statusFilter} />}
        <div className="search-wrap" style={{ maxWidth: 340 }}>
          <span className="search-icon"><Icon name="search" size={14} /></span>
          <input
            id="admin-search"
            name="search"
            type="text"
            className="field-input search-input"
            placeholder={t("admin.search")}
            defaultValue={search}
            style={{ fontSize: 13 }}
          />
        </div>
      </form>

      {/* Table */}
      <div className="card" style={{ overflow: "hidden" }}>
        <div className="admin-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t("admin.table_title")}</th>
                <th>{t("admin.table_category")}</th>
                <th>{t("admin.table_status")}</th>
                <th>{t("admin.table_votes")}</th>
                <th>{t("admin.table_author")}</th>
                <th>{t("admin.table_date")}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {complaints.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="empty" style={{ padding: "40px 24px" }}>
                      <Icon name="file" size={32} className="empty-icon" />
                      <p className="empty-title" style={{ fontSize: 14 }}>{t("admin.table_empty")}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                complaints.map((c) => (
                  <tr key={c.id}>
                    <td style={{ maxWidth: 260 }}>
                      <p style={{ fontWeight: 600, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--text)" }}>
                        {c.title}
                      </p>
                      {c.location && (
                        <p style={{ fontSize: 11, color: "var(--text-4)", marginTop: 2, display: "flex", alignItems: "center", gap: 3 }}>
                          <Icon name="mapPin" size={9} /> {c.location}
                        </p>
                      )}
                    </td>
                    <td>
                      <span className="badge badge-neutral" style={{ fontSize: 11 }}>
                        {t(`categories.${c.category.toLowerCase()}` as any)}
                      </span>
                    </td>
                    <td><StatusBadge status={c.status} /></td>
                    <td>
                      <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 600, color: "var(--text-2)" }}>
                        <Icon name="arrowUp" size={11} /> {c._count.votes}
                      </span>
                    </td>
                    <td style={{ fontSize: 12.5, color: "var(--text-3)" }}>
                      {c.isAnonymous ? "—" : (c.author.name ?? c.author.email)}
                    </td>
                    <td style={{ fontSize: 11.5, color: "var(--text-4)", whiteSpace: "nowrap" }}>
                      {fmtDate(c.createdAt, locale)}
                    </td>
                    <td>
                      <Link href={`/admin/complaint/${c.id}`}>
                        <button className="btn btn-ghost btn-sm" style={{ gap: 4, fontSize: 12 }}>
                          {t("admin.change_status")}
                          <Icon name="chevronRight" size={12} />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
