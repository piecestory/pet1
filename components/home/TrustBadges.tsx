import { prisma } from "@/lib/prisma";
import { BADGE_ICONS } from "@/lib/badge-icons";

export default async function TrustBadges() {
  const badges = await prisma.trustBadge.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" }
  });

  if (badges.length === 0) return null;

  return (
    <section style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", marginTop: 50 }}>
      <div
        className="container grid-5"
        style={{
          display: "grid",
          padding: "28px 40px",
          gap: 20,
          rowGap: 24
        }}
      >
        {badges.map((b) => {
          const IconComp = BADGE_ICONS[b.icon]?.icon;
          return (
            <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center" }}>
              {IconComp && <IconComp size={26} color="var(--accent)" />}
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{b.title}</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{b.subtitle}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
