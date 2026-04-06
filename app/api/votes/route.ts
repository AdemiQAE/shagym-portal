import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { complaintId } = await req.json();

  if (!complaintId) {
    return NextResponse.json({ error: "complaintId required" }, { status: 400 });
  }

  try {
    await prisma.$transaction([
      prisma.vote.create({ data: { userId, complaintId } }),
      prisma.complaint.update({
        where: { id: complaintId },
        data: { votesCount: { increment: 1 } },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Already voted" }, { status: 409 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { complaintId } = await req.json();

  try {
    await prisma.$transaction([
      prisma.vote.delete({ where: { userId_complaintId: { userId, complaintId } } }),
      prisma.complaint.update({
        where: { id: complaintId },
        data: { votesCount: { decrement: 1 } },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Vote not found" }, { status: 404 });
  }
}
