import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ration Distribution Admin",
  description: "نظام إدارة توزيع المواد الغذائية",

  openGraph: {
    title: "Ration Distribution Admin",
    description: "نظام إدارة توزيع المواد الغذائية",
    images: [
      {
        url: "/preview.png",
        width: 1200,
        height: 630,
        alt: "Ration Distribution System",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Ration Distribution Admin",
    description: "نظام إدارة توزيع المواد الغذائية",
    images: ["/preview.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}