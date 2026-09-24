import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, requireRole } from "@/lib/auth";
import { success, failure } from "@/lib/api-response";

// المفاتيح المسموح بقراءتها/تعديلها عبر هذه الواجهة (إعدادات المتجر + السكربتات)
const ALLOWED_KEYS = [
  "store_name",
  "store_email",
  "store_phone",
  "tax_rate",
  "script_ga",
  "script_meta_pixel",
  "script_custom_head"
] as const;

// GET /api/settings  (لوحة الإدارة فقط - تُعاد كل المفاتيح ككائن key: value)
export async function GET() {
  const user = getCurrentUser();
  if (!requireRole(user, ["SUPER_ADMIN", "MANAGER"])) {
    return failure("غير مصرح لك بهذا الإجراء", 403);
  }

  const rows = await prisma.setting.findMany({ where: { key: { in: [...ALLOWED_KEYS] } } });
  const map: Record<string, string> = {};
  for (const key of ALLOWED_KEYS) map[key] = "";
  for (const row of rows) map[row.key] = row.value;

  return success(map);
}

const schema = z.object(
  Object.fromEntries(ALLOWED_KEYS.map((k) => [k, z.string().optional()]))
);

// PUT /api/settings  (لوحة الإدارة فقط - حفظ عدة مفاتيح دفعة واحدة)
export async function PUT(req: NextRequest) {
  const user = getCurrentUser();
  if (!requireRole(user, ["SUPER_ADMIN", "MANAGER"])) {
    return failure("غير مصرح لك بهذا الإجراء", 403);
  }

  try {
    const body = schema.parse(await req.json());
    const entries = Object.entries(body).filter(([, v]) => v !== undefined) as [string, string][];

    await Promise.all(
      entries.map(([key, value]) =>
        prisma.setting.upsert({
          where: { key },
          update: { value },
          create: { key, value }
        })
      )
    );

    return success({ saved: true });
  } catch (err) {
    if (err instanceof z.ZodError) return failure(err.errors[0].message, 422);
    return failure("حدث خطأ أثناء حفظ الإعدادات", 500);
  }
}
