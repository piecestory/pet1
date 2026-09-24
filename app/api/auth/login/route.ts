import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signToken, setAuthCookie } from "@/lib/auth";
import { success, failure } from "@/lib/api-response";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json());

    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user || !user.isActive) return failure("بيانات الدخول غير صحيحة", 401);

    const valid = await verifyPassword(body.password, user.passwordHash);
    if (!valid) return failure("بيانات الدخول غير صحيحة", 401);

    const token = signToken({ userId: user.id, role: user.role });
    setAuthCookie(token);

    return success({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    if (err instanceof z.ZodError) return failure(err.errors[0].message, 422);
    return failure("حدث خطأ أثناء تسجيل الدخول", 500);
  }
}
