import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ComplaintStatus } from "@prisma/client";
import { isTransitionAllowed } from "@/lib/status-transitions";

/**
 * @api {get} /api/complaints/[id] Получение деталей жалобы
 * @param {string} id ID жалобы
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
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

    if (!complaint) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(complaint);
  } catch (error) {
    console.error("[COMPLAINT_GET]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * @api {patch} /api/complaints/[id] Обновление статуса жалобы
 * @auth Только для ADMIN
 * @param {string} status Новый статус (ComplaintStatus)
 * @param {string} comment Комментарий админа
 * @param {string[]} images Список Base64 изображений отчета
 */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    const { id } = await params;
    const userId = session?.user?.id;
    const role = session?.user?.role;

    if (!session || !userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    if (!body.status || role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const complaint = await prisma.complaint.findUnique({ where: { id } });
    if (!complaint) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (!isTransitionAllowed(complaint.status, body.status as ComplaintStatus)) {
      return NextResponse.json(
        { error: `Transition from ${complaint.status} to ${body.status} is not allowed` },
        { status: 400 }
      );
    }

    const [updated] = await prisma.$transaction([
      prisma.complaint.update({
        where: { id },
        data: { status: body.status as ComplaintStatus },
      }),
      prisma.statusLog.create({
        data: {
          complaintId: id,
          changedById: userId,
          oldStatus: complaint.status,
          newStatus: body.status as ComplaintStatus,
          comment: body.comment ?? null,
          images: body.images ?? [],
        },
      }),
    ]);

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[COMPLAINT_PATCH]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
