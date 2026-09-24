import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard, { ProductCardData } from "@/components/product/ProductCard";

const PRODUCTS: ProductCardData[] = [
  { id: "1", slug: "vintage-vase", title: "مزهرية صينية قديمة", price: 1850, image: "/images/product-vase.jpg" },
  { id: "2", slug: "french-clock", title: "ساعة كلاسيكية فرنسية", price: 2950, image: "/images/product-clock.jpg" },
  { id: "3", slug: "luxury-chair", title: "كرسي كلاسيك فاخر", price: 3750, image: "/images/product-chair.jpg" },
  { id: "4", slug: "crystal-chandelier", title: "نجفة كريستال ذهبية", price: 4200, image: "/images/product-chandelier.jpg" },
  { id: "5", slug: "vintage-gramophone", title: "جرامافون أنتيك قديم", price: 2150, image: "/images/product-gramophone.jpg" },
  { id: "6", slug: "oil-painting", title: "لوحة زيتية أوروبية", price: 6500, image: "/images/featured-1.jpg" }
];

const FILTERS = [
  { label: "التصنيف", options: ["تحف وانتيك", "أواني منزلية", "لوحات فنية", "أثاث كلاسيك", "نجف وإضاءة"] },
  { label: "الدولة", options: ["فرنسا", "إيطاليا", "الصين", "الدولة العثمانية"] },
  { label: "الحقبة", options: ["القرن 18", "القرن 19", "القرن 20"] },
  { label: "المادة", options: ["خشب", "برونز", "كريستال", "خزف"] }
];

export default function ShopPage() {
  return (
    <>
      <Header />
      <main className="container layout-sidebar page-padding">
        {/* الفلاتر */}
        <aside className="card" style={{ padding: 24, height: "fit-content" }}>
          <h3 style={{ fontSize: 18, marginBottom: 18 }}>الفلاتر</h3>
          {FILTERS.map((f) => (
            <div key={f.label} style={{ marginBottom: 22 }}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10 }}>{f.label}</div>
              {f.options.map((opt) => (
                <label key={opt} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, marginBottom: 8, color: "var(--text-secondary)" }}>
                  <input type="checkbox" /> {opt}
                </label>
              ))}
            </div>
          ))}
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10 }}>السعر</div>
            <input type="range" min={0} max={20000} style={{ width: "100%" }} />
          </div>
        </aside>

        {/* المنتجات */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
            <span style={{ color: "var(--text-secondary)", fontSize: 14 }}>{PRODUCTS.length} منتج</span>
            <select
              style={{
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                padding: "8px 14px",
                background: "var(--surface)"
              }}
            >
              <option>الأحدث</option>
              <option>السعر: من الأقل للأعلى</option>
              <option>السعر: من الأعلى للأقل</option>
            </select>
          </div>

          <div className="grid-auto grid-3">
            {PRODUCTS.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {/* Pagination */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 40 }}>
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                className="btn"
                style={{
                  background: n === 1 ? "var(--primary)" : "var(--surface)",
                  color: n === 1 ? "var(--surface)" : "var(--text)",
                  border: "1px solid var(--border)",
                  minWidth: 40
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
