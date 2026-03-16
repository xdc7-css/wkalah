import type { Metadata } from "next";
import { Alexandria, Tajawal } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const headFont = Alexandria({
  subsets: ["arabic"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700", "800"],
});

const bodyFont = Tajawal({
  subsets: ["arabic"],
  variable: "--font-body",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Ration Distribution Admin",
  description: "نظام إدارة توزيع المواد الغذائية",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
// ... (rest of metadata)

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
    <html lang="ar" dir="rtl" className={`${headFont.variable} ${bodyFont.variable}`} suppressHydrationWarning>
      <body className="font-body">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}