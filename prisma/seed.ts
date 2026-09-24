import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // مستخدم Super Admin
  const passwordHash = await bcrypt.hash("Admin@12345", 10);
  await prisma.user.upsert({
    where: { email: "admin@qet3a-w-qesa.sa" },
    update: {},
    create: {
      name: "مدير النظام",
      email: "admin@qet3a-w-qesa.sa",
      passwordHash,
      role: "SUPER_ADMIN"
    }
  });

  // التصنيفات
  const categories = [
    { name: "تحف وانتيك", slug: "antiques", image: "/images/cat-antiques.jpg", order: 0 },
    { name: "أواني منزلية", slug: "household", image: "/images/cat-household.jpg", order: 1 },
    { name: "قطع أثرية", slug: "rare-pieces", image: "/images/cat-rare.jpg", order: 2 },
    { name: "لوحات فنية", slug: "paintings", image: "/images/cat-paintings.jpg", order: 3 },
    { name: "أثاث كلاسيك", slug: "classic-furniture", image: "/images/cat-furniture.jpg", order: 4 },
    { name: "نجف وإضاءة", slug: "chandeliers", image: "/images/cat-chandeliers.jpg", order: 5 }
  ];

  for (const c of categories) {
    await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c });
  }

  // محتوى الصفحة الرئيسية (Hero + البانرات) - نفس النصوص الحالية حتى يبقى الموقع كما هو
  const contentBlocks = [
    {
      key: "hero",
      title: "حيث تلتقي الأصالة بالفخامة",
      subtitle: "اكتشف مجموعة مختارة بعناية من التحف والقطع النادرة المصممة لتروي قصة كل عصر.",
      imageUrl: "/images/hero-antique.jpg",
      linkUrl: "/shop",
      linkText: "تصفح المتجر"
    },
    {
      key: "promo_auction",
      title: "المزادات الإلكترونية",
      subtitle: "شارك الآن واقتنِ القطع النادرة",
      imageUrl: "/images/promo-auction.jpg",
      linkUrl: "/auction",
      linkText: "اكتشف المزادات"
    },
    {
      key: "promo_shopper",
      title: "الباحث الشخصي",
      subtitle: "نبحث لك عن القطعة التي تريدها",
      imageUrl: "/images/promo-shopper.jpg",
      linkUrl: "/personal-shopper",
      linkText: "اطلب الآن"
    }
  ];

  for (const b of contentBlocks) {
    await prisma.contentBlock.upsert({ where: { key: b.key }, update: {}, create: b });
  }

  // آراء العملاء
  const testimonials = [
    { name: "سارة العتيبي", text: "تجربة استثنائية، القطعة وصلت مغلفة بعناية فائقة وبنفس جودة الصور.", rating: 5, order: 0 },
    { name: "خالد الشمري", text: "خدمة الباحث الشخصي ساعدتني أجد قطعة كنت أبحث عنها منذ سنوات.", rating: 5, order: 1 },
    { name: "منى الحربي", text: "تعامل راقٍ ومنتجات أصلية، أنصح بالتعامل معهم بكل ثقة.", rating: 5, order: 2 }
  ];

  for (const t of testimonials) {
    const existing = await prisma.testimonial.findFirst({ where: { name: t.name } });
    if (!existing) await prisma.testimonial.create({ data: t });
  }

  // شارات الثقة
  const trustBadges = [
    { icon: "truck", title: "شحن سريع وآمن", subtitle: "داخل السعودية", order: 0 },
    { icon: "gift", title: "تغليف فاخر", subtitle: "وحماية مضمونة", order: 1 },
    { icon: "shield-check", title: "منتجات أصلية", subtitle: "100% موثوقة", order: 2 },
    { icon: "headphones", title: "دعم العملاء", subtitle: "على مدار الساعة", order: 3 },
    { icon: "package-check", title: "إرجاع واستبدال", subtitle: "سهل وسريع", order: 4 }
  ];

  for (const b of trustBadges) {
    const existing = await prisma.trustBadge.findFirst({ where: { title: b.title } });
    if (!existing) await prisma.trustBadge.create({ data: b });
  }

  // الإعدادات الافتراضية (بيانات المتجر + مفاتيح السكربتات فارغة)
  const settings = [
    { key: "store_name", value: "قطعة وقصة" },
    { key: "store_email", value: "info@qet3a-w-qesa.sa" },
    { key: "store_phone", value: "" },
    { key: "tax_rate", value: "15" },
    { key: "script_ga", value: "" },
    { key: "script_meta_pixel", value: "" },
    { key: "script_custom_head", value: "" }
  ];

  for (const s of settings) {
    await prisma.setting.upsert({ where: { key: s.key }, update: {}, create: s });
  }

  console.log("تم زرع البيانات الأساسية بنجاح ✅");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
