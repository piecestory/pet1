import { NextRequest } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, requireRole } from "@/lib/auth";
import { success, failure } from "@/lib/api-response";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

// GET /api/media  (مكتبة الوسائط بالكامل - لوحة الإدارة فقط)
export async function GET() {
  const user = getCurrentUser();
  if (!requireRole(user, ["SUPER_ADMIN", "MANAGER", "STAFF"])) {
    return failure("غير مصرح لك بهذا الإجراء", 403);
  }

  const media = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });
  return success(media);
}

// POST /api/media  (multipart/form-data, حقل "files" يدعم عدة ملفات)
// يرفع الملفات فعليًا إلى public/uploads ويسجّلها في جدول media حتى تظهر في المكتبة
export async function POST(req: NextRequest) {
  const user = getCurrentUser();
  if (!requireRole(user, ["SUPER_ADMIN", "MANAGER", "STAFF"])) {
    return failure("غير مصرح لك بهذا الإجراء", 403);
  }

  const formData = await req.formData();
  const files = formData.getAll("files") as File[];
  if (!files.length) return failure("لم يتم إرفاق أي ملفات", 400);

  await mkdir(UPLOAD_DIR, { recursive: true });

  const created = [];
  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    await writeFile(path.join(UPLOAD_DIR, filename), buffer);

    const media = await prisma.media.create({
      data: {
        url: `/uploads/${filename}`,
        filename,
        originalName: file.name,
        mimeType: file.type || "application/octet-stream",
        size: buffer.length
      }
    });
    created.push(media);
  }

  return success({ items: created, urls: created.map((m) => m.url) }, 201);
}
