import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";

const DEFAULTS: Record<string, { title: string; subtitle: string; imageUrl: string; linkUrl: string; linkText: string; btnClass: string }> = {
  promo_auction: {
    title: "المزادات الإلكترونية",
    subtitle: "شارك الآن واقتنِ القطع النادرة",
    imageUrl: "/images/promo-auction.jpg",
    linkUrl: "/auction",
    linkText: "اكتشف المزادات",
    btnClass: "btn btn-primary"
  },
  promo_shopper: {
    title: "الباحث الشخصي",
    subtitle: "نبحث لك عن القطعة التي تريدها",
    imageUrl: "/images/promo-shopper.jpg",
    linkUrl: "/personal-shopper",
    linkText: "اطلب الآن",
    btnClass: "btn btn-dark"
  }
};

export default async function PromoBanners() {
  const blocks = await prisma.contentBlock.findMany({ where: { key: { in: ["promo_auction", "promo_shopper"] } } });
  const byKey = Object.fromEntries(blocks.map((b) => [b.key, b]));

  return (
    <section className="container grid-auto grid-2" style={{ marginTop: 24 }}>
      {(["promo_auction", "promo_shopper"] as const).map((key) => {
        const d = DEFAULTS[key];
        const b = byKey[key];
        const title = b?.title || d.title;
        const subtitle = b?.subtitle || d.subtitle;
        const imageUrl = b?.imageUrl || d.imageUrl;
        const linkUrl = b?.linkUrl || d.linkUrl;
        const linkText = b?.linkText || d.linkText;

        return (
          <div
            key={key}
            style={{
              position: "relative",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
              minHeight: 230,
              backgroundImage: `linear-gradient(90deg, rgba(20,15,12,0.85), rgba(20,15,12,0.35)), url('${imageUrl}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "0 32px",
              textAlign: "right"
            }}
          >
            <h3 style={{ color: "var(--surface)", fontSize: 24, marginBottom: 8 }}>{title}</h3>
            <p style={{ color: "#ddd", fontSize: 14, marginBottom: 18 }}>{subtitle}</p>
            <Link href={linkUrl} className={d.btnClass} style={{ width: "fit-content" }}>
              {linkText}
              <ArrowLeft size={16} />
            </Link>
          </div>
        );
      })}
    </section>
  );
}
