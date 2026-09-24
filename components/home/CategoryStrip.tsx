import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function CategoryStrip() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    take: 6
  });

  if (categories.length === 0) return null;

  return (
    <section className="container category-strip" style={{ position: "relative", zIndex: 2 }}>
      <div
        className="card grid-6"
        style={{
          display: "grid",
          gap: 16,
          padding: 24
        }}
      >
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/shop?category=${cat.slug}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              padding: "14px 16px"
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "var(--section)",
                backgroundImage: cat.image ? `url(${cat.image})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
                flexShrink: 0
              }}
            />
            <div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>{cat.name}</div>
              <div style={{ fontSize: 12, color: "var(--accent)" }}>تسوق الآن</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
