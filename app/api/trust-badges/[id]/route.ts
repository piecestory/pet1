import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, requireRole } from "@/lib/auth";
import { success, failure } from "@/lib/api-response";

const schema = z.object({
  icon: z.string().min(2).optional(),
  title: z.string().min(2).optional(),
  subtitle: z.string().optional(),
  order: z.number().int().optional(),
  isActive: z.boolean().optional()
});

// PUT /api/trust-badges/:id  (لوحة الإدارة فقط)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getCurrentUser();
  if (!requireRole(user, ["SUPER_ADMIN", "MANAGER"])) {
    return failure("غير مصرح لك بهذا الإجراء", 403);
  }
  try {
    const body = schema.parse(await req.json());
    const badge = await prisma.trustBadge.update({ where: { id: params.id }, data: body });
    return success(badge);
  } catch (err) {
    if (err instanceof z.ZodError) return failure(err.errors[0].message, 422);
    return failure("حدث خطأ أثناء التعديل", 500);
  }
}

// DELETE /api/trust-badges/:id  (لوحة الإدارة فقط)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const user = getCurrentUser();
  if (!requireRole(user, ["SUPER_ADMIN", "MANAGER"])) {
    return failure("غير مصرح لك بهذا الإجراء", 403);
  }
  await prisma.trustBadge.delete({ where: { id: params.id } });
  return success({ deleted: true });
}
