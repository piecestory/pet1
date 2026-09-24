"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Trash2, Plus, ImagePlus } from "lucide-react";
import { BADGE_ICONS, BADGE_ICON_KEYS } from "@/lib/badge-icons";

interface Block {
  key: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  linkUrl: string;
  linkText: string;
}

interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  order: number;
  isActive: boolean;
}

interface TrustBadge {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  order: number;
  isActive: boolean;
}

const EMPTY_BLOCK = (key: string): Block => ({ key, title: "", subtitle: "", imageUrl: "", linkUrl: "", linkText: "" });

const labelStyle: React.CSSProperties = { fontSize: 13, color: "var(--text-secondary)", display: "block", marginBottom: 6 };
const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-sm)",
  padding: "11px 14px",
  fontFamily: "var(--font-ar)"
};

async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("files", file);
  const res = await fetch("/api/media", { method: "POST", body: formData });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.error || "فشل رفع الصورة");
  return json.data.urls[0];
}

export default function AdminContentPage() {
  const [blocks, setBlocks] = useState<Record<string, Block>>({
    hero: EMPTY_BLOCK("hero"),
    promo_auction: EMPTY_BLOCK("promo_auction"),
    promo_shopper: EMPTY_BLOCK("promo_shopper")
  });
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [badges, setBadges] = useState<TrustBadge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/content").then((r) => r.json()),
      fetch("/api/testimonials").then((r) => r.json()),
      fetch("/api/trust-badges").then((r) => r.json())
    ]).then(([contentRes, testRes, badgeRes]) => {
      if (contentRes.success) {
        setBlocks((prev) => {
          const next = { ...prev };
          for (const b of contentRes.data) {
            next[b.key] = {
              key: b.key,
              title: b.title || "",
              subtitle: b.subtitle || "",
              imageUrl: b.imageUrl || "",
              linkUrl: b.linkUrl || "",
              linkText: b.linkText || ""
            };
          }
          return next;
        });
      }
      if (testRes.success) setTestimonials(testRes.data);
      if (badgeRes.success) setBadges(badgeRes.data);
      setLoading(false);
    });
  }, []);

  function updateBlock(key: string, patch: Partial<Block>) {
    setBlocks((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }));
  }

  async function saveBlock(key: string) {
    const block = blocks[key];
    await fetch(`/api/content/${key}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: block.title,
        subtitle: block.subtitle,
        imageUrl: block.imageUrl,
        linkUrl: block.linkUrl,
        linkText: block.linkText
      })
    });
    alert("تم الحفظ بنجاح");
  }

  if (loading) {
    return <div style={{ padding: 30, textAlign: "center", color: "var(--text-secondary)" }}>جاري التحميل...</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <div>
        <h1 style={{ fontSize: 24, marginBottom: 6 }}>محتوى الصفحة الرئيسية</h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
          تعديل النصوص والصور الظاهرة في أعلى الصفحة الرئيسية، وآراء العملاء، وشارات الثقة.
        </p>
      </div>

      <BlockEditor title="قسم Hero (أعلى الصفحة الرئيسية)" block={blocks.hero} onChange={(p) => updateBlock("hero", p)} onSave={() => saveBlock("hero")} />
      <BlockEditor title="بانر المزادات" block={blocks.promo_auction} onChange={(p) => updateBlock("promo_auction", p)} onSave={() => saveBlock("promo_auction")} />
      <BlockEditor title="بانر الباحث الشخصي" block={blocks.promo_shopper} onChange={(p) => updateBlock("promo_shopper", p)} onSave={() => saveBlock("promo_shopper")} />

      <TestimonialsSection items={testimonials} setItems={setTestimonials} />
      <TrustBadgesSection items={badges} setItems={setBadges} />
    </div>
  );
}

function BlockEditor({
  title,
  block,
  onChange,
  onSave
}: {
  title: string;
  block: Block;
  onChange: (patch: Partial<Block>) => void;
  onSave: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      onChange({ imageUrl: url });
    } catch {
      alert("فشل رفع الصورة");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="card" style={{ padding: 24 }}>
      <h3 style={{ fontSize: 16, marginBottom: 16 }}>{title}</h3>
      <div className="grid-auto grid-2" style={{ gap: 16, marginBottom: 16 }}>
        <div>
          <label style={labelStyle}>العنوان</label>
          <input value={block.title} onChange={(e) => onChange({ title: e.target.value })} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>رابط الزر</label>
          <input value={block.linkUrl} onChange={(e) => onChange({ linkUrl: e.target.value })} style={inputStyle} placeholder="/shop" />
        </div>
        <div>
          <label style={labelStyle}>نص الزر</label>
          <input value={block.linkText} onChange={(e) => onChange({ linkText: e.target.value })} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>الصورة الخلفية</label>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {block.imageUrl && (
              <div style={{ position: "relative", width: 60, height: 60, borderRadius: "var(--radius-sm)", overflow: "hidden", flexShrink: 0, border: "1px solid var(--border)" }}>
                <Image src={block.imageUrl} alt="" fill style={{ objectFit: "cover" }} unoptimized />
              </div>
            )}
            <label className="btn btn-outline" style={{ cursor: "pointer", fontSize: 13, padding: "9px 14px" }}>
              <ImagePlus size={14} />
              {uploading ? "جاري الرفع..." : "تغيير الصورة"}
              <input type="file" accept="image/*" onChange={handleImage} disabled={uploading} style={{ display: "none" }} />
            </label>
          </div>
        </div>
      </div>
      <div>
        <label style={labelStyle}>النص الفرعي</label>
        <textarea
          rows={2}
          value={block.subtitle}
          onChange={(e) => onChange({ subtitle: e.target.value })}
          style={{ ...inputStyle, marginBottom: 16 }}
        />
      </div>
      <button
        className="btn btn-primary"
        disabled={saving}
        onClick={async () => {
          setSaving(true);
          await onSave();
          setSaving(false);
        }}
      >
        {saving ? "جاري الحفظ..." : "حفظ"}
      </button>
    </div>
  );
}

function TestimonialsSection({
  items,
  setItems
}: {
  items: Testimonial[];
  setItems: React.Dispatch<React.SetStateAction<Testimonial[]>>;
}) {
  const [form, setForm] = useState({ name: "", text: "", rating: "5" });
  const [adding, setAdding] = useState(false);

  async function handleAdd() {
    if (!form.name || !form.text) return;
    setAdding(true);
    const res = await fetch("/api/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, text: form.text, rating: Number(form.rating), order: items.length })
    });
    const json = await res.json();
    setAdding(false);
    if (json.success) {
      setItems((prev) => [...prev, json.data]);
      setForm({ name: "", text: "", rating: "5" });
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("حذف هذا الرأي؟")) return;
    await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="card" style={{ padding: 24 }}>
      <h3 style={{ fontSize: 16, marginBottom: 16 }}>آراء العملاء</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
        {items.map((t) => (
          <div
            key={t.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 12,
              padding: "12px 14px",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)"
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>
                {t.name} <span style={{ color: "var(--gold)", fontWeight: 400, fontSize: 12 }}>({t.rating}★)</span>
              </div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4 }}>{t.text}</div>
            </div>
            <button onClick={() => handleDelete(t.id)} style={{ color: "var(--error)", flexShrink: 0 }} aria-label="حذف">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        {items.length === 0 && <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>لا توجد آراء بعد.</p>}
      </div>

      <div className="grid-auto grid-2" style={{ gap: 10, marginBottom: 10 }}>
        <input placeholder="اسم العميل" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} />
        <select value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} style={inputStyle}>
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} نجوم
            </option>
          ))}
        </select>
      </div>
      <textarea
        placeholder="نص الرأي"
        rows={2}
        value={form.text}
        onChange={(e) => setForm({ ...form, text: e.target.value })}
        style={{ ...inputStyle, marginBottom: 10 }}
      />
      <button className="btn btn-outline" disabled={adding} onClick={handleAdd} style={{ width: "fit-content" }}>
        <Plus size={14} />
        {adding ? "جاري الإضافة..." : "إضافة رأي"}
      </button>
    </div>
  );
}

function TrustBadgesSection({
  items,
  setItems
}: {
  items: TrustBadge[];
  setItems: React.Dispatch<React.SetStateAction<TrustBadge[]>>;
}) {
  const [form, setForm] = useState({ icon: BADGE_ICON_KEYS[0], title: "", subtitle: "" });
  const [adding, setAdding] = useState(false);

  async function handleAdd() {
    if (!form.title) return;
    setAdding(true);
    const res = await fetch("/api/trust-badges", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ icon: form.icon, title: form.title, subtitle: form.subtitle, order: items.length })
    });
    const json = await res.json();
    setAdding(false);
    if (json.success) {
      setItems((prev) => [...prev, json.data]);
      setForm({ icon: BADGE_ICON_KEYS[0], title: "", subtitle: "" });
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("حذف هذه الشارة؟")) return;
    await fetch(`/api/trust-badges/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((b) => b.id !== id));
  }

  return (
    <div className="card" style={{ padding: 24 }}>
      <h3 style={{ fontSize: 16, marginBottom: 16 }}>شارات الثقة</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
        {items.map((b) => {
          const IconComp = BADGE_ICONS[b.icon]?.icon;
          return (
            <div
              key={b.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 14px",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)"
              }}
            >
              {IconComp && <IconComp size={20} color="var(--accent)" />}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{b.title}</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{b.subtitle}</div>
              </div>
              <button onClick={() => handleDelete(b.id)} style={{ color: "var(--error)" }} aria-label="حذف">
                <Trash2 size={16} />
              </button>
            </div>
          );
        })}
        {items.length === 0 && <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>لا توجد شارات بعد.</p>}
      </div>

      <div className="grid-auto grid-3" style={{ gap: 10, marginBottom: 10 }}>
        <select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} style={inputStyle}>
          {BADGE_ICON_KEYS.map((key) => (
            <option key={key} value={key}>
              {BADGE_ICONS[key].label}
            </option>
          ))}
        </select>
        <input placeholder="العنوان" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} style={inputStyle} />
        <input placeholder="النص الفرعي" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} style={inputStyle} />
      </div>
      <button className="btn btn-outline" disabled={adding} onClick={handleAdd} style={{ width: "fit-content" }}>
        <Plus size={14} />
        {adding ? "جاري الإضافة..." : "إضافة شارة"}
      </button>
    </div>
  );
}
