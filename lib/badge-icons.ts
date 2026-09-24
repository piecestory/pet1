import { Truck, Gift, ShieldCheck, Headphones, PackageCheck, type LucideIcon } from "lucide-react";

// مفاتيح الأيقونات المتاحة لشارات الثقة - تُستخدم في لوحة الإدارة (قائمة اختيار)
// وفي الصفحة الرئيسية (عرض الأيقونة الفعلية) حتى تبقى القيم متطابقة دائمًا.
export const BADGE_ICONS: Record<string, { label: string; icon: LucideIcon }> = {
  truck: { label: "شاحنة (شحن)", icon: Truck },
  gift: { label: "هدية (تغليف)", icon: Gift },
  "shield-check": { label: "درع (ضمان/أصالة)", icon: ShieldCheck },
  headphones: { label: "سماعة (دعم عملاء)", icon: Headphones },
  "package-check": { label: "طرد (إرجاع/استبدال)", icon: PackageCheck }
};

export const BADGE_ICON_KEYS = Object.keys(BADGE_ICONS);
