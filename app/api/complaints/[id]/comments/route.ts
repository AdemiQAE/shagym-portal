import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

/**
 * @api {post} /api/complaints/[id]/comments Добавление комментария к жалобе
 * @auth Требуется авторизация
 * @param {string} id ID жалобы
 * @param {string} text Текст комментария
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: complaintId } = await params;
    const { text } = await req.json();

    if (!text?.trim()) {
      return NextResponse.json({ error: "Comment text required" }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        text: text.trim(),
        authorId: session.user.id,
        complaintId: complaintId,
      },
      include: {
        author: { select: { name: true } },
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("[COMMENT_POST]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
