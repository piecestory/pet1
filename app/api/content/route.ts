import { prisma } from "@/lib/prisma";
import { success } from "@/lib/api-response";

// GET /api/content  (كل عناصر محتوى الصفحة الرئيسية - Hero + البانرات)
// عامة (تُستخدم من لوحة الإدارة للقراءة قبل التعديل)
export async function GET() {
  const blocks = await prisma.contentBlock.findMany();
  return success(blocks);
}
