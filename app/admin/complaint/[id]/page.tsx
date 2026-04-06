import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { StatusBadge } from "@/components/complaint/StatusBadge";
import { AdminComplaintForm } from "@/components/admin/AdminComplaintForm";
import Link from "next/link";

function formatDate(d: Date) {
  return new Date(d).toLocaleString("ru-RU", {
    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
  });
}

const STATUS_EMOJI: Record<string, string> = {
  PENDING: "⏳", ACCEPTED: "✅", IN_PROGRESS: "🔄", RESOLVED: "🏁", CANCELLED: "❌",
};

export default async function AdminComplaintDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const t = await getTranslations();
  if (!session || session.user?.role !== "ADMIN") redirect("/");

  const { id } = await params;
  const complaint = await prisma.complaint.findUnique({
    where: { id },
    include: {
      author: { select: { name: true, email: true } },
      _count: { select: { votes: true, comments: true } },
      statusLogs: {
        include: { changedBy: { select: { name: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!complaint) notFound();

  const CATEGORIES: Record<string, string> = {
    road: "Жол / Дорога", housing: "ТКШ / ЖКХ", ecology: "Экология",
    safety: "Қауіпсіздік / Безопасность", education: "Білім / Образование", other: "Басқа / Другое",
  };

  return (
    <div className="container page" style={{ maxWidth: 900 }}>
      {/* Breadcrumb */}
      <nav style={{ marginBottom: 24, fontSize: 14, color: "var(--text-3)", display: "flex", gap: 8 }}>
        <Link href="/admin" style={{ color: "var(--text-3)" }}>← {t("admin.title")}</Link>
        <span>/</span>
        <span style={{ color: "var(--text-2)" }}>#{id.slice(0, 8)}</span>
      </nav>

      <div className="two-col" style={{ alignItems: "start" }}>
        {/* Left — complaint info */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Info card */}
          <div className="card animate-fade-up" style={{ padding: 24 }}>
            <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 12, lineHeight: 1.3 }}>
              {complaint.title}
            </h1>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              <StatusBadge status={complaint.status} />
              <span className="badge badge-default">{CATEGORIES[complaint.category] ?? complaint.category}</span>
              <span className="badge badge-default">↑ {complaint._count.votes}</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              {complaint.location && (
                <p style={{ fontSize: 13, color: "var(--text-2)" }}>📍 {complaint.location}</p>
              )}
              <p style={{ fontSize: 13, color: "var(--text-2)" }}>
                👤 {complaint.isAnonymous ? "Анонимді / Анонимно" : `${complaint.author.name} (${complaint.author.email})`}
              </p>
              <p style={{ fontSize: 13, color: "var(--text-3)" }}>📅 {formatDate(complaint.createdAt)}</p>
            </div>

            <div className="divider" />
            <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--text)", whiteSpace: "pre-wrap" }}>
              {complaint.description}
            </p>

            {complaint.images.length > 0 && (
              <>
                <div className="divider" />
                <div className="photo-gallery">
                  {complaint.images.map((img, i) => (
                    <img key={i} src={img} alt="" />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Status log */}
          {complaint.statusLogs.length > 0 && (
            <div className="card" style={{ padding: 24 }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>📋 {t("complaint.timeline")}</h2>
              {complaint.statusLogs.map((log) => (
                <div key={log.id} style={{ display: "flex", gap: 12, position: "relative", marginBottom: 20 }}>
                  <div className="status-marker" style={{ fontSize: 16 }}>
                    {STATUS_EMOJI[log.newStatus] ?? "📝"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{log.changedBy.name}</span>
                      <span style={{ fontSize: 12, color: "var(--text-3)" }}>{formatDate(log.createdAt)}</span>
                    </div>
                    {log.comment && <p style={{ fontSize: 14, color: "var(--text-2)", marginBottom: 8 }}>{log.comment}</p>}
                    {log.images.length > 0 && (
                      <div className="photo-gallery" style={{ marginTop: 8 }}>
                        {log.images.map((img, i) => (
                          <img key={i} src={img} alt="" />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right — admin form */}
        <div style={{ position: "sticky", top: "calc(var(--header-height) + 24px)" }}>
          <div className="card" style={{ padding: 24 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>
              ⚙️ Мәртебені өзгерту / Изменить статус
            </h2>
            <AdminComplaintForm
              complaintId={complaint.id}
              currentStatus={complaint.status}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
