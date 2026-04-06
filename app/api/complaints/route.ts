import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Prisma, ComplaintStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sort = searchParams.get("sort") ?? "top";
  const category = searchParams.get("category");
  const status = searchParams.get("status");
  const search = searchParams.get("search");

  const where: Prisma.ComplaintWhereInput = {};
  if (category && category !== "all") where.category = category;
  if (status && status !== "all") {
    // Basic validation for status enum
    const validStatuses = Object.values(ComplaintStatus);
    if (validStatuses.includes(status as ComplaintStatus)) {
      where.status = status as ComplaintStatus;
    }
  }
  if (search) where.OR = [
    { title: { contains: search, mode: "insensitive" } },
    { description: { contains: search, mode: "insensitive" } },
  ];

  const orderBy = sort === "new"
    ? { createdAt: "desc" as const }
    : { votesCount: "desc" as const };

  const complaints = await prisma.complaint.findMany({
    where,
    orderBy,
    take: 50,
    include: {
      author: { select: { name: true } },
      _count: { select: { votes: true } },
    },
  });

  return NextResponse.json(complaints);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const body = await req.json();
  const { title, description, category, location, isAnonymous, images } = body;

  if (!title?.trim() || !description?.trim()) {
    return NextResponse.json({ error: "Title and description required" }, { status: 400 });
  }

  const complaint = await prisma.complaint.create({
    data: {
      title: title.trim(),
      description: description.trim(),
      category: category ?? "other",
      location: location?.trim() || null,
      isAnonymous: !!isAnonymous,
      images: images ?? [],
      authorId: userId,
    },
  });

  return NextResponse.json(complaint, { status: 201 });
}
