"use client";

import { useEffect, useState } from "react";

const FIELDS = [
  { key: "store_name", label: "اسم المتجر" },
  { key: "store_email", label: "البريد الإلكتروني للتواصل" },
  { key: "store_phone", label: "رقم الهاتف" },
  { key: "tax_rate", label: "نسبة الضريبة (%)" }
] as const;

const SCRIPT_FIELDS = [
  { key: "script_ga", label: "معرّف Google Analytics (Measurement ID)", placeholder: "G-XXXXXXXXXX" },
  { key: "script_meta_pixel", label: "معرّف Meta Pixel", placeholder: "123456789012345" }
] as const;

type SettingsMap = Record<string, string>;

export default function AdminSettingsPage() {
  const [values, setValues] = useState<SettingsMap>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setValues(json.data);
        setLoading(false);
      });
  }, []);

  function update(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });
    const json = await res.json();
    setSaving(false);
    if (json.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  }

  if (loading) {
    return <div style={{ padding: 30, textAlign: "center", color: "var(--text-secondary)" }}>جاري التحميل...</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <h1 style={{ fontSize: 24 }}>الإعدادات</h1>

      <div className="card" style={{ padding: 24, maxWidth: 560, display: "flex", flexDirection: "column", gap: 16 }}>
        <h3 style={{ fontSize: 15 }}>بيانات المتجر</h3>
        {FIELDS.map((f) => (
          <Field key={f.key} label={f.label} value={values[f.key] || ""} onChange={(v) => update(f.key, v)} />
        ))}
      </div>

      <div className="card" style={{ padding: 24, maxWidth: 560, display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <h3 style={{ fontSize: 15, marginBottom: 4 }}>السكربتات</h3>
          <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
            سكربتات التتبع والتسويق التي تُضاف تلقائيًا لكل صفحات الموقع دون الحاجة لتعديل الكود.
          </p>
        </div>
        {SCRIPT_FIELDS.map((f) => (
          <Field
            key={f.key}
            label={f.label}
            value={values[f.key] || ""}
            placeholder={f.placeholder}
            onChange={(v) => update(f.key, v)}
          />
        ))}
        <div>
          <label style={{ fontSize: 13, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>
            كود مخصص إضافي (يُضاف داخل &lt;head&gt;)
          </label>
          <textarea
            rows={5}
            value={values.script_custom_head || ""}
            onChange={(e) => update("script_custom_head", e.target.value)}
            placeholder="<script>...</script>"
            dir="ltr"
            style={{
              width: "100%",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              padding: "11px 14px",
              fontFamily: "monospace",
              fontSize: 13
            }}
          />
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button className="btn btn-primary" disabled={saving} onClick={handleSave} style={{ width: "fit-content" }}>
          {saving ? "جاري الحفظ..." : "حفظ الإعدادات"}
        </button>
        {saved && <span style={{ color: "var(--success)", fontSize: 14 }}>تم الحفظ بنجاح ✓</span>}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  placeholder,
  onChange
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label style={{ fontSize: 13, color: "var(--text-secondary)", display: "block", marginBottom: 6 }}>{label}</label>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "11px 14px" }}
      />
    </div>
  );
}
