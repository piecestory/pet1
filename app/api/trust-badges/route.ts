import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, requireRole } from "@/lib/auth";
import { success, failure } from "@/lib/api-response";

// GET /api/trust-badges
export async function GET() {
  const badges = await prisma.trustBadge.findMany({ orderBy: { order: "asc" } });
  return success(badges);
}

const schema = z.object({
  icon: z.string().min(2),
  title: z.string().min(2),
  subtitle: z.string().optional(),
  order: z.number().int().default(0)
});

// POST /api/trust-badges  (لوحة الإدارة فقط)
export async function POST(req: NextRequest) {
  const user = getCurrentUser();
  if (!requireRole(user, ["SUPER_ADMIN", "MANAGER"])) {
    return failure("غير مصرح لك بهذا الإجراء", 403);
  }
  try {
    const body = schema.parse(await req.json());
    const badge = await prisma.trustBadge.create({ data: body });
    return success(badge, 201);
  } catch (err) {
    if (err instanceof z.ZodError) return failure(err.errors[0].message, 422);
    return failure("حدث خطأ أثناء إضافة الشارة", 500);
  }
}
