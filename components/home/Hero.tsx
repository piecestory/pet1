import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";

const DEFAULTS = {
  title: "حيث تلتقي الأصالة بالفخامة",
  subtitle: "اكتشف مجموعة مختارة بعناية من التحف والقطع النادرة المصممة لتروي قصة كل عصر.",
  imageUrl: "/images/hero-antique.jpg",
  linkUrl: "/shop",
  linkText: "تصفح المتجر"
};

export default async function Hero() {
  const block = await prisma.contentBlock.findUnique({ where: { key: "hero" } });

  const title = block?.title || DEFAULTS.title;
  const subtitle = block?.subtitle || DEFAULTS.subtitle;
  const imageUrl = block?.imageUrl || DEFAULTS.imageUrl;
  const linkUrl = block?.linkUrl || DEFAULTS.linkUrl;
  const linkText = block?.linkText || DEFAULTS.linkText;

  return (
    <section
      style={{
        position: "relative",
        minHeight: 420,
        height: "60vh",
        maxHeight: 560,
        backgroundImage: `linear-gradient(90deg, rgba(43,33,27,0.6) 0%, rgba(43,33,27,0.25) 55%, rgba(43,33,27,0.1) 100%), url('${imageUrl}')`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div
        className="container"
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-end",
          textAlign: "right",
          maxWidth: 560
        }}
      >
        <h1 className="hero-title" style={{ color: "var(--surface)", fontSize: 44, lineHeight: 1.3, marginBottom: 16 }}>
          {title}
        </h1>
        <p className="hero-text" style={{ color: "#EFE7DD", fontSize: 16, marginBottom: 24, lineHeight: 1.9 }}>
          {subtitle}
        </p>
        <Link href={linkUrl} className="btn btn-primary">
          {linkText}
          <ArrowLeft size={18} />
        </Link>
      </div>
    </section>
  );
}
