import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, Inter } from "next/font/google";
import "./globals.css";

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ar-loaded",
  display: "swap"
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-en-loaded",
  display: "swap"
});

export const metadata: Metadata = {
  title: "قطعة وقصة | Piece & Story - معرض التحف والأنتيك الفاخر",
  description:
    "قطعة وقصة - معرض إلكتروني فاخر لبيع التحف والأنتيك والأثاث الكلاسيكي واللوحات الفنية والنجف والقطع النادرة.",
  keywords: ["تحف", "أنتيك", "أثاث كلاسيكي", "لوحات فنية", "نجف", "قطع نادرة", "قطعة وقصة"]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${plexArabic.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
