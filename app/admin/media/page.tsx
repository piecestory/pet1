"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Upload, Trash2, Copy, Check, File as FileIcon } from "lucide-react";

interface MediaItem {
  id: string;
  url: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaLibraryPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function loadMedia() {
    setLoading(true);
    const res = await fetch("/api/media");
    const json = await res.json();
    if (json.success) setItems(json.data);
    setLoading(false);
  }

  useEffect(() => {
    loadMedia();
  }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setError("");
    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      const res = await fetch("/api/media", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "فشل رفع الملفات");
      await loadMedia();
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذا الملف؟ لا يمكن التراجع عن هذا الإجراء.")) return;
    const res = await fetch(`/api/media/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) setItems((prev) => prev.filter((m) => m.id !== id));
  }

  function handleCopy(item: MediaItem) {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1 style={{ fontSize: 24 }}>مكتبة الوسائط</h1>
        <label className="btn btn-primary" style={{ cursor: "pointer" }}>
          <Upload size={16} />
          {uploading ? "جاري الرفع..." : "رفع ملفات"}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,application/pdf"
            onChange={handleUpload}
            disabled={uploading}
            style={{ display: "none" }}
          />
        </label>
      </div>

      {error && (
        <div
          style={{
            background: "#FBEAE6",
            border: "1px solid var(--error)",
            color: "var(--error)",
            padding: "12px 16px",
            borderRadius: "var(--radius-sm)",
            marginBottom: 18,
            fontSize: 14
          }}
        >
          {error}
        </div>
      )}

      <div className="card" style={{ padding: 20 }}>
        {loading ? (
          <div style={{ padding: 30, textAlign: "center", color: "var(--text-secondary)" }}>جاري التحميل...</div>
        ) : items.length === 0 ? (
          <div style={{ padding: 30, textAlign: "center", color: "var(--text-secondary)" }}>
            لا توجد ملفات بعد. اضغط &quot;رفع ملفات&quot; لإضافة أول صورة أو ملف.
          </div>
        ) : (
          <div className="grid-auto grid-5" style={{ gap: 16 }}>
            {items.map((item) => {
              const isImage = item.mimeType.startsWith("image/");
              return (
                <div
                  key={item.id}
                  style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", overflow: "hidden" }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "1 / 1",
                      background: "var(--section)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    {isImage ? (
                      <Image src={item.url} alt={item.originalName} fill style={{ objectFit: "cover" }} unoptimized />
                    ) : (
                      <FileIcon size={32} color="var(--text-secondary)" />
                    )}
                  </div>
                  <div style={{ padding: 10 }}>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      }}
                      title={item.originalName}
                    >
                      {item.originalName}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-secondary)", marginBottom: 8 }}>
                      {formatSize(item.size)}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => handleCopy(item)}
                        style={{
                          flex: 1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 4,
                          fontSize: 12,
                          padding: "6px 8px",
                          border: "1px solid var(--border)",
                          borderRadius: "var(--radius-sm)",
                          background: "var(--surface)"
                        }}
                      >
                        {copiedId === item.id ? <Check size={13} /> : <Copy size={13} />}
                        {copiedId === item.id ? "تم النسخ" : "نسخ الرابط"}
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        aria-label="حذف"
                        style={{
                          padding: "6px 8px",
                          border: "1px solid var(--border)",
                          borderRadius: "var(--radius-sm)",
                          background: "var(--surface)",
                          color: "var(--error)"
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
