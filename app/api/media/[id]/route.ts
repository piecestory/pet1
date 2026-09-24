import path from "path";
import { unlink } from "fs/promises";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, requireRole } from "@/lib/auth";
import { success, failure } from "@/lib/api-response";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

// DELETE /api/media/:id  (لوحة الإدارة فقط)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const user = getCurrentUser();
  if (!requireRole(user, ["SUPER_ADMIN", "MANAGER", "STAFF"])) {
    return failure("غير مصرح لك بهذا الإجراء", 403);
  }

  const media = await prisma.media.findUnique({ where: { id: params.id } });
  if (!media) return failure("الملف غير موجود", 404);

  // محاولة حذف الملف فعليًا من القرص (لا تفشل العملية إن كان محذوفًا مسبقًا)
  try {
    await unlink(path.join(UPLOAD_DIR, media.filename));
  } catch {
    // الملف غير موجود على القرص أصلاً - نتجاهل ونكمل حذف السجل
  }

  await prisma.media.delete({ where: { id: params.id } });
  return success({ deleted: true });
}
