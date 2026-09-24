import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, requireRole } from "@/lib/auth";
import { success, failure } from "@/lib/api-response";

// GET /api/testimonials  (تُستخدم من لوحة الإدارة للعرض قبل التعديل)
export async function GET() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { order: "asc" } });
  return success(testimonials);
}

const schema = z.object({
  name: z.string().min(2),
  text: z.string().min(2),
  rating: z.number().int().min(1).max(5).default(5),
  order: z.number().int().default(0)
});

// POST /api/testimonials  (لوحة الإدارة فقط)
export async function POST(req: NextRequest) {
  const user = getCurrentUser();
  if (!requireRole(user, ["SUPER_ADMIN", "MANAGER"])) {
    return failure("غير مصرح لك بهذا الإجراء", 403);
  }
  try {
    const body = schema.parse(await req.json());
    const testimonial = await prisma.testimonial.create({ data: body });
    return success(testimonial, 201);
  } catch (err) {
    if (err instanceof z.ZodError) return failure(err.errors[0].message, 422);
    return failure("حدث خطأ أثناء إضافة الرأي", 500);
  }
}
