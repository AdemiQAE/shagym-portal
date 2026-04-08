import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Prisma, ComplaintStatus } from "@prisma/client";

/**
 * @api {get} /api/complaints Получение списка жалоб
 * @query {string} sort Тип сортировки: 'top' (по умолчанию) или 'new'
 * @query {string} category Фильтр по категории
 * @query {string} status Фильтр по статусу
 * @query {string} search Поиск по заголовку и описанию
 */
export async function GET(req: NextRequest) {
  try {
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
  } catch (error) {
    console.error("[COMPLAINTS_GET]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * @api {post} /api/complaints Создание новой жалобы
 * @auth Требуется авторизация
 * @param {string} title Заголовок
 * @param {string} description Описание
 * @param {string} category Категория
 * @param {string} location Текстовый адрес
 * @param {number} latitude Широта
 * @param {number} longitude Долгота
 * @param {boolean} isAnonymous Анонимно или нет
 * @param {string[]} images Список Base64 изображений
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();
    const { title, description, category, location, latitude, longitude, isAnonymous, images } = body;

    if (!title?.trim() || !description?.trim()) {
      return NextResponse.json({ error: "Title and description required" }, { status: 400 });
    }

    // Optimization: Create complaint and initial status log in a transaction
    const complaint = await prisma.$transaction(async (tx) => {
      const newComplaint = await tx.complaint.create({
        data: {
          title: title.trim(),
          description: description.trim(),
          category: category ?? "other",
          location: location?.trim() || null,
          latitude: latitude ? parseFloat(latitude) : null,
          longitude: longitude ? parseFloat(longitude) : null,
          isAnonymous: !!isAnonymous,
          images: images ?? [],
          authorId: userId,
        } as any,
      });

      // Log initial status
      await tx.statusLog.create({
        data: {
          complaintId: newComplaint.id,
          changedById: userId,
          newStatus: "PENDING",
          comment: "Initial submission",
        },
      });

      return newComplaint;
    });

    return NextResponse.json(complaint, { status: 201 });
  } catch (error) {
    console.error("[COMPLAINTS_POST]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
