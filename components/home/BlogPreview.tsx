import Link from "next/link";

const POSTS = [
  { slug: "post-1", title: "كيف تميّز التحف الأصلية عن المقلدة", image: "/images/blog-1.jpg" },
  { slug: "post-2", title: "قصة الأثاث الفرنسي الكلاسيكي", image: "/images/blog-2.jpg" },
  { slug: "post-3", title: "دليل العناية بالقطع الأثرية النادرة", image: "/images/blog-3.jpg" }
];

export default function BlogPreview() {
  return (
    <section className="container" style={{ marginTop: 50 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <h2 style={{ fontSize: 26 }}>المدونة</h2>
        <Link href="/blog" style={{ color: "var(--accent)", fontWeight: 600 }}>
          عرض الكل
        </Link>
      </div>
      <div className="grid-auto grid-3">
        {POSTS.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="card" style={{ overflow: "hidden" }}>
            <div
              style={{
                width: "100%",
                height: 180,
                backgroundImage: `url(${p.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            />
            <div style={{ padding: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600 }}>{p.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
