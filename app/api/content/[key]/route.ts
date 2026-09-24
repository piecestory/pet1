import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, requireRole } from "@/lib/auth";
import { success, failure } from "@/lib/api-response";

const schema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  imageUrl: z.string().optional(),
  linkUrl: z.string().optional(),
  linkText: z.string().optional()
});

// PUT /api/content/:key  (تعديل Hero أو أحد البانرات - لوحة الإدارة فقط)
export async function PUT(req: NextRequest, { params }: { params: { key: string } }) {
  const user = getCurrentUser();
  if (!requireRole(user, ["SUPER_ADMIN", "MANAGER"])) {
    return failure("غير مصرح لك بهذا الإجراء", 403);
  }

  try {
    const body = schema.parse(await req.json());
    const block = await prisma.contentBlock.upsert({
      where: { key: params.key },
      update: body,
      create: { key: params.key, ...body }
    });
    return success(block);
  } catch (err) {
    if (err instanceof z.ZodError) return failure(err.errors[0].message, 422);
    return failure("حدث خطأ أثناء حفظ المحتوى", 500);
  }
}
