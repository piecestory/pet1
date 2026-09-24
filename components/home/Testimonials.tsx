import { Star } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function Testimonials() {
  const reviews = await prisma.testimonial.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" }
  });

  if (reviews.length === 0) return null;

  return (
    <section style={{ background: "var(--section)", padding: "50px 0", marginTop: 50 }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <span className="section-label">ثقة عملائنا</span>
          <h2 style={{ fontSize: 28, marginTop: 8 }}>آراء العملاء</h2>
        </div>
        <div className="grid-auto grid-3">
          {reviews.map((r) => (
            <div key={r.id} className="card" style={{ padding: 24 }}>
              <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
                {Array.from({ length: r.rating }).map((_, s) => (
                  <Star key={s} size={16} fill="var(--gold)" color="var(--gold)" />
                ))}
              </div>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 14 }}>{r.text}</p>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{r.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
