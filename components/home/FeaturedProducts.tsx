import ProductCard, { ProductCardData } from "@/components/product/ProductCard";
import { prisma } from "@/lib/prisma";

export default async function FeaturedProducts() {
  const products = await prisma.product.findMany({
    where: { isFeatured: true, isActive: true },
    orderBy: { createdAt: "desc" },
    take: 4,
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
    <section style={{ background: "var(--section)", padding: "50px 0" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <span className="section-label">مختارات المعرض</span>
          <h2 style={{ fontSize: 28, marginTop: 8 }}>المنتجات المميزة</h2>
        </div>
        <div className="grid-auto grid-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
