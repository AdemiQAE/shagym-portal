import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ComplaintStatus } from "@prisma/client";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await params;
  const userId = session?.user?.id;
  const role = session?.user?.role;

  if (!session || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  // Admin can change status
  if (body.status && role === "ADMIN") {
    const complaint = await prisma.complaint.findUnique({ where: { id } });
    if (!complaint) return NextResponse.json({ error: "Not found" }, { status: 404 });

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
  }

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
