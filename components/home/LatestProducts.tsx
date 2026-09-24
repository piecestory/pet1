import Link from "next/link";
import ProductCard, { ProductCardData } from "@/components/product/ProductCard";
import { prisma } from "@/lib/prisma";

export default async function LatestProducts() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { images: { orderBy: { order: "asc" }, take: 1 } }
  });

  if (products.length === 0) return null;

  const items: ProductCardData[] = products.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    price: Number(p.price),
    image: p.images[0]?.url || "/images/placeholder.jpg"
  }));

  return (
    <section className="container" style={{ marginTop: 50 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <h2 style={{ fontSize: 26 }}>أحدث القطع</h2>
        <Link href="/shop" style={{ color: "var(--accent)", fontWeight: 600 }}>
          عرض الكل
        </Link>
      </div>
      <div className="grid-auto grid-5">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
