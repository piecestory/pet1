import ProductCard, { ProductCardData } from "@/components/product/ProductCard";
import { prisma } from "@/lib/prisma";

export default async function RareFinds() {
  const products = await prisma.product.findMany({
    where: { isRare: true, isActive: true },
    orderBy: { createdAt: "desc" },
    take: 3,
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
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <span className="section-label">لعشاق التميز</span>
        <h2 style={{ fontSize: 28, marginTop: 8 }}>التحف النادرة</h2>
      </div>
      <div className="grid-auto grid-3">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
